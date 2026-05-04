package com.sentinel.engine;

import com.sentinel.models.MonitoredService;
import com.sentinel.models.PingLog;
import com.sentinel.repositories.MonitoredServiceRepository;
import com.sentinel.repositories.PingLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Component
public class PollingEngine {
    private static final Logger logger = LoggerFactory.getLogger(PollingEngine.class);
    private final MonitoredServiceRepository serviceRepository;
    private final PingLogRepository pingLogRepository;
    private final WebClient webClient;

    public PollingEngine(MonitoredServiceRepository serviceRepository, PingLogRepository pingLogRepository) {
        this.serviceRepository = serviceRepository;
        this.pingLogRepository = pingLogRepository;
        this.webClient = WebClient.builder().build();
    }

    @Scheduled(fixedRateString = "${POLLING_INTERVAL:60000}")
    public void pollServices() {
        List<MonitoredService> services = serviceRepository.findByIsActiveTrue();
        services.forEach(this::pingService);
    }

    private void pingService(MonitoredService service) {
        long startTime = System.currentTimeMillis();
        webClient.get()
                .uri(service.getUrl())
                .exchangeToMono(response -> {
                    long endTime = System.currentTimeMillis();
                    PingLog log = PingLog.builder()
                            .serviceId(service.getId())
                            .timestamp(Instant.now())
                            .responseTimeMs(endTime - startTime)
                            .statusCode(response.statusCode().value())
                            .build();
                    logger.info("Ping SUCCESS: {} | Status: {} | Latency: {}ms", service.getUrl(), log.getStatusCode(), log.getResponseTimeMs());
                    return Mono.just(log);
                })
                .timeout(Duration.ofSeconds(10))
                .onErrorResume(e -> {
                    PingLog log = PingLog.builder()
                            .serviceId(service.getId())
                            .timestamp(Instant.now())
                            .responseTimeMs(System.currentTimeMillis() - startTime)
                            .statusCode(500)
                            .build();
                    logger.error("Ping ERROR: {} | Reason: {}", service.getUrl(), e.getMessage());
                    return Mono.just(log);
                })
                .subscribe(pingLogRepository::save);
    }
}
