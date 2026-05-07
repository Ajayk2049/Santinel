package com.sentinel.repositories;

import com.sentinel.models.PingLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface PingLogRepository extends MongoRepository<PingLog, String> {
    List<PingLog> findByServiceIdOrderByTimestampDesc(String serviceId);
    Optional<PingLog> findFirstByServiceIdOrderByTimestampDesc(String serviceId);
    Page<PingLog> findByServiceIdAndStatusCodeGreaterThanEqualOrderByTimestampDesc(String serviceId, int statusCode, Pageable pageable);
    List<PingLog> findTop100ByServiceIdOrderByTimestampDesc(String serviceId);
}
