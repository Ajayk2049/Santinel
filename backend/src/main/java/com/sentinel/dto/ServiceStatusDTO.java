package com.sentinel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceStatusDTO {
    private String id;
    private String name;
    private String url;
    private boolean isActive;
    private int lastStatusCode;
    private long lastResponseTimeMs;
    private double avgResponseTime;
    private String lastTimestamp;
    private String status; // UP/DOWN
    private String lastMessage;
}
