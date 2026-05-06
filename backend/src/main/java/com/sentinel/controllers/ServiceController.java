package com.sentinel.controllers;

import com.sentinel.dto.ServiceStatusDTO;
import com.sentinel.engine.TelemetryEngineService;
import com.sentinel.models.MonitoredService;
import com.sentinel.models.PingLog;
import com.sentinel.models.User;
import com.sentinel.repositories.MonitoredServiceRepository;
import com.sentinel.repositories.PingLogRepository;
import com.sentinel.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {
    private static final Logger logger = LoggerFactory.getLogger(ServiceController.class);
    private final MonitoredServiceRepository serviceRepository;
    private final PingLogRepository pingLogRepository;
    private final UserRepository userRepository;
    private final TelemetryEngineService telemetryEngineService;

    private String getCurrentUserId() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(email).map(User::getId).orElse(null);
    }

    @GetMapping
    public List<ServiceStatusDTO> getServices() {
        String userId = getCurrentUserId();
        return serviceRepository.findByUserId(userId).stream()
                .map(service -> {
                    List<PingLog> logs = pingLogRepository.findByServiceIdOrderByTimestampDesc(service.getId());
                    
                    double avgResponseTime = logs.stream()
                            .limit(10)
                            .mapToLong(PingLog::getResponseTimeMs)
                            .average()
                            .orElse(0.0);

                    ServiceStatusDTO.ServiceStatusDTOBuilder builder = ServiceStatusDTO.builder()
                            .id(service.getId())
                            .name(service.getName())
                            .url(service.getUrl())
                            .isActive(service.isActive())
                            .avgResponseTime(avgResponseTime);

                    if (!logs.isEmpty()) {
                        PingLog latest = logs.get(0);
                        builder.lastStatusCode(latest.getStatusCode())
                               .lastResponseTimeMs(latest.getResponseTimeMs())
                               .lastTimestamp(latest.getTimestamp().toString())
                               .status(latest.getStatusCode() >= 200 && latest.getStatusCode() < 300 ? "UP" : "DOWN");
                    } else {
                        builder.status("DOWN");
                    }

                    return builder.build();
                })
                .collect(Collectors.toList());
    }

    @PostMapping
    public MonitoredService addService(@RequestBody MonitoredService service) {
        String userId = getCurrentUserId();
        service.setUserId(userId);
        service.setActive(true);
        MonitoredService saved = serviceRepository.save(service);
        telemetryEngineService.executePingProtocol(saved);
        return saved;
    }

    @DeleteMapping("/{id}")
    public void deleteService(@PathVariable String id) {
        serviceRepository.deleteById(id);
    }
}
