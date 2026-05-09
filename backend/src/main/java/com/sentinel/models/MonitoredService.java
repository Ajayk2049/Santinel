package com.sentinel.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "monitored_services")
public class MonitoredService {
    @Id
    private String id;
    private String userId;
    private String workspaceId;
    private String name;
    private String url;
    private boolean isActive;
    
    @Builder.Default
    private String httpMethod = "GET";
    private Map<String, String> headers;
    private String authType;
    private String authToken;
    private String requestBody;

    @Builder.Default
    private Instant createdAt = Instant.now();
    @Builder.Default
    private Integer pingInterval = 30;
}
