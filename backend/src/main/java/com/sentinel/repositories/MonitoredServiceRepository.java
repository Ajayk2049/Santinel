package com.sentinel.repositories;

import com.sentinel.models.MonitoredService;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MonitoredServiceRepository extends MongoRepository<MonitoredService, String> {
    List<MonitoredService> findByUserId(String userId);
    List<MonitoredService> findByUserIdAndWorkspaceId(String userId, String workspaceId);
    List<MonitoredService> findByUserIdAndWorkspaceIdIsNull(String userId);
    List<MonitoredService> findByIsActiveTrue();
}
