package com.sentinel.engine;

import com.sentinel.models.MonitoredService;
import com.sentinel.models.PingLog;
import com.sentinel.repositories.MonitoredServiceRepository;
import com.sentinel.repositories.PingLogRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TelemetryEngineService {
    private static final Logger logger = LoggerFactory.getLogger(TelemetryEngineService.class);
    private final MonitoredServiceRepository serviceRepository;
    private final PingLogRepository pingLogRepository;
    private final WebClient webClient = WebClient.builder().build();

    @Scheduled(fixedRate = 60000)
    public void runTelemetryCycle() {
        logger.info("Initiating fleet-wide telemetry cycle...");
        List<MonitoredService> activeServices = serviceRepository.findByIsActiveTrue();
        activeServices.forEach(this::executePingProtocol);
    }

    public void executePingProtocol(MonitoredService service) {
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
                    return Mono.just(log);
                })
                .subscribe(pingLog -> {
                    pingLogRepository.save(pingLog);
                    logger.info("Signal Captured: {} | Status: {} | Latency: {}ms", 
                                service.getUrl(), pingLog.getStatusCode(), pingLog.getResponseTimeMs());
                });
    }
}
