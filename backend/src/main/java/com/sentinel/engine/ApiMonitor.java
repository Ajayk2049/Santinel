package com.sentinel.engine;

import com.sentinel.models.MonitoredService;
import com.sentinel.models.PingLog;
import com.sentinel.repositories.MonitoredServiceRepository;
import com.sentinel.repositories.PingLogRepository;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;

@Component
@RequiredArgsConstructor
public class ApiMonitor {
    private static final Logger logger = LoggerFactory.getLogger(ApiMonitor.class);
    private final MonitoredServiceRepository serviceRepository;
    private final PingLogRepository pingLogRepository;
    private final TaskScheduler taskScheduler;
    
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final Map<String, ScheduledFuture<?>> scheduledTasks = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        logger.info("Initializing global fleet surveillance protocols...");
        List<MonitoredService> activeServices = serviceRepository.findByIsActiveTrue();
        activeServices.forEach(this::scheduleService);
    }

    @PreDestroy
    public void cleanup() {
        logger.info("Deactivating all active surveillance signals...");
        scheduledTasks.values().forEach(task -> task.cancel(false));
        scheduledTasks.clear();
    }

    public void scheduleService(MonitoredService service) {
        stopService(service.getId());
        
        int interval = service.getPingInterval() != null ? service.getPingInterval() : 30;
        logger.info("Scheduling surveillance for {} | Protocol Frequency: {}s", service.getName(), interval);
        
        ScheduledFuture<?> task = taskScheduler.scheduleWithFixedDelay(
            () -> executePingProtocol(service),
            Duration.ofSeconds(interval)
        );
        scheduledTasks.put(service.getId(), task);
    }

    public void stopService(String serviceId) {
        ScheduledFuture<?> existing = scheduledTasks.remove(serviceId);
        if (existing != null) {
            existing.cancel(false);
            logger.info("Signal terminated for service ID: {}", serviceId);
        }
    }

    public void executePingProtocol(MonitoredService service) {
        long startTime = System.currentTimeMillis();
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(service.getUrl()))
                    .timeout(Duration.ofSeconds(10))
                    .GET()
                    .build();

            httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenApply(response -> {
                        long endTime = System.currentTimeMillis();
                        String body = response.body();
                        String message = (body != null && !body.isEmpty()) ? body : "// No response body";
                        
                        return PingLog.builder()
                                .serviceId(service.getId())
                                .timestamp(Instant.now())
                                .responseTimeMs(endTime - startTime)
                                .statusCode(response.statusCode())
                                .message(message)
                                .build();
                    })
                    .exceptionally(e -> {
                        return PingLog.builder()
                                .serviceId(service.getId())
                                .timestamp(Instant.now())
                                .responseTimeMs(System.currentTimeMillis() - startTime)
                                .statusCode(500)
                                .message("PROTOCOL_FAILURE: " + e.getMessage())
                                .build();
                    })
                    .thenAccept(pingLog -> {
                        pingLogRepository.save(pingLog);
                        logger.debug("Signal captured from {} | Status: {} | Latency: {}ms", 
                                service.getName(), pingLog.getStatusCode(), pingLog.getResponseTimeMs());
                    });

        } catch (Exception e) {
            logger.error("Failed to initiate ping protocol for {}: {}", service.getName(), e.getMessage());
        }
    }
}
