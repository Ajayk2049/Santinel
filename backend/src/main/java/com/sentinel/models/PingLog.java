package com.sentinel.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "ping_logs")
public class PingLog {
    @Id
    private String id;
    private String serviceId;
    private Instant timestamp;
    private long responseTimeMs;
    private int statusCode;
}
