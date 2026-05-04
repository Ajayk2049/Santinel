package com.sentinel.controllers;

import com.sentinel.dto.ServiceStatusDTO;
import com.sentinel.models.MonitoredService;
import com.sentinel.models.User;
import com.sentinel.repositories.MonitoredServiceRepository;
import com.sentinel.repositories.PingLogRepository;
import com.sentinel.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {
    private final MonitoredServiceRepository serviceRepository;
    private final PingLogRepository pingLogRepository;
    private final UserRepository userRepository;

    private String getCurrentUserId() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(email).map(User::getId).orElse(null);
    }

    @GetMapping
    public List<MonitoredService> getServices() {
        return serviceRepository.findByUserId(getCurrentUserId());
    }

    @PostMapping
    public MonitoredService addService(@RequestBody MonitoredService service) {
        service.setUserId(getCurrentUserId());
        return serviceRepository.save(service);
    }

    @PutMapping("/{id}")
    public MonitoredService updateService(@PathVariable String id, @RequestBody MonitoredService service) {
        service.setId(id);
        service.setUserId(getCurrentUserId());
        return serviceRepository.save(service);
    }

    @DeleteMapping("/{id}")
    public void deleteService(@PathVariable String id) {
        serviceRepository.deleteById(id);
    }

    @GetMapping("/status")
    public List<ServiceStatusDTO> getFleetStatus() {
        return serviceRepository.findByUserId(getCurrentUserId()).stream()
                .map(service -> {
                    ServiceStatusDTO.ServiceStatusDTOBuilder builder = ServiceStatusDTO.builder()
                            .id(service.getId())
                            .alias(service.getAlias())
                            .url(service.getUrl())
                            .isActive(service.isActive());

                    pingLogRepository.findFirstByServiceIdOrderByTimestampDesc(service.getId())
                            .ifPresent(log -> {
                                builder.lastStatusCode(log.getStatusCode())
                                       .lastResponseTimeMs(log.getResponseTimeMs())
                                       .lastTimestamp(log.getTimestamp().toString());
                            });

                    return builder.build();
                })
                .collect(Collectors.toList());
    }
}
