package com.sentinel.controllers;

import com.sentinel.dto.ServiceStatusDTO;
import com.sentinel.engine.ApiMonitor;
import com.sentinel.models.MonitoredService;
import com.sentinel.models.PingLog;
import com.sentinel.models.User;
import com.sentinel.repositories.MonitoredServiceRepository;
import com.sentinel.repositories.PingLogRepository;
import com.sentinel.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
    private final ApiMonitor apiMonitor;

    private String getCurrentUserId() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(email).map(User::getId).orElse(null);
    }

    @GetMapping("/status")
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

                    List<PingLog> uptimeLogs = pingLogRepository.findTop100ByServiceIdOrderByTimestampDesc(service.getId());
                    double uptime = uptimeLogs.isEmpty() ? 100.0 : 
                        (double) uptimeLogs.stream().filter(l -> l.getStatusCode() >= 200 && l.getStatusCode() < 300).count() 
                        / uptimeLogs.size() * 100.0;

                    if (!logs.isEmpty()) {
                        PingLog latest = logs.get(0);
                        builder.lastStatusCode(latest.getStatusCode())
                               .lastResponseTimeMs(latest.getResponseTimeMs())
                               .lastTimestamp(latest.getTimestamp().toString())
                               .lastMessage(latest.getMessage())
                               .status(latest.getStatusCode() >= 200 && latest.getStatusCode() < 300 ? "UP" : "DOWN")
                               .uptimePercentage(uptime);
                    } else {
                        builder.status("DOWN")
                               .uptimePercentage(uptime);
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
        apiMonitor.scheduleService(saved);
        return saved;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@PathVariable String id) {
        apiMonitor.stopService(id);
        serviceRepository.deleteById(id);
        // Also delete associated logs
        pingLogRepository.findByServiceIdOrderByTimestampDesc(id).forEach(log -> pingLogRepository.delete(log));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/retry")
    public ResponseEntity<?> retryPing(@PathVariable String id) {
        return serviceRepository.findById(id).map(service -> {
            apiMonitor.executePingProtocol(service);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/incidents")
    public Page<PingLog> getIncidents(@PathVariable String id, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return pingLogRepository.findByServiceIdAndStatusCodeGreaterThanEqualOrderByTimestampDesc(id, 400, PageRequest.of(page, size));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MonitoredService> updateService(@PathVariable String id, @RequestBody MonitoredService updatedService) {
        return serviceRepository.findById(id).map(existing -> {
            existing.setName(updatedService.getName());
            existing.setUrl(updatedService.getUrl());
            existing.setPingInterval(updatedService.getPingInterval());
            MonitoredService saved = serviceRepository.save(existing);
            apiMonitor.scheduleService(saved);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }
}
