package com.sentinel.repositories;

import com.sentinel.models.PingLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface PingLogRepository extends MongoRepository<PingLog, String> {
    List<PingLog> findByServiceIdOrderByTimestampDesc(String serviceId);
    Optional<PingLog> findFirstByServiceIdOrderByTimestampDesc(String serviceId);
}
