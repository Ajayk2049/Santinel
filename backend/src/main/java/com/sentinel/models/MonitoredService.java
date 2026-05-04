package com.sentinel.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "monitored_services")
public class MonitoredService {
    @Id
    private String id;
    private String userId;
    private String url;
    private String alias;
    private boolean isActive;
}
