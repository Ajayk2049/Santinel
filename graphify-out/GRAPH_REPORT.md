# Graph Report - .  (2026-05-06)

## Corpus Check
- Corpus is ~9,027 words - fits in a single context window. You may not need a graph.

## Summary
- 95 nodes · 77 edges · 31 communities (16 shown, 15 thin omitted)
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.82)
- Token cost: 9,000 input · 1,800 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Authentication & User Management|Authentication & User Management]]
- [[_COMMUNITY_User Repositories|User Repositories]]
- [[_COMMUNITY_Frontend State & Dashboard|Frontend State & Dashboard]]
- [[_COMMUNITY_Security Configuration|Security Configuration]]
- [[_COMMUNITY_Service Repositories|Service Repositories]]
- [[_COMMUNITY_Ping Log Repositories|Ping Log Repositories]]
- [[_COMMUNITY_Theme & Rendering|Theme & Rendering]]
- [[_COMMUNITY_Dashboard Polling|Dashboard Polling]]
- [[_COMMUNITY_Telemetry Engine|Telemetry Engine]]
- [[_COMMUNITY_Application Entry Point|Application Entry Point]]
- [[_COMMUNITY_Core UI Layout|Core UI Layout]]
- [[_COMMUNITY_Service DTOs|Service DTOs]]
- [[_COMMUNITY_Monitored Service Model|Monitored Service Model]]
- [[_COMMUNITY_Ping Log Model|Ping Log Model]]
- [[_COMMUNITY_User Model|User Model]]
- [[_COMMUNITY_Auth Backend Logic|Auth Backend Logic]]
- [[_COMMUNITY_System Documentation|System Documentation]]
- [[_COMMUNITY_Security Core|Security Core]]

## God Nodes (most connected - your core abstractions)
1. `ServiceController` - 6 edges
2. `ApiMonitor` - 6 edges
3. `SecurityConfig` - 4 edges
4. `Dashboard` - 4 edges
5. `AuthController` - 3 edges
6. `MonitoredServiceRepository` - 3 edges
7. `PingLogRepository` - 3 edges
8. `UserRepository` - 3 edges
9. `usePolling()` - 3 edges
10. `SentinelApplication` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Sentinel README` --references--> `SentinelApplication`  [INFERRED]
  README.md → backend/src/main/java/com/sentinel/SentinelApplication.java
- `Project Progress` --references--> `Dashboard`  [INFERRED]
  progress.md → frontend/src/pages/Dashboard.jsx
- `Dashboard()` --calls--> `usePolling()`  [INFERRED]
  frontend/src/pages/Dashboard.jsx → frontend/src/hooks/usePolling.js
- `AuthController` --references--> `User`  [EXTRACTED]
  backend/src/main/java/com/sentinel/controllers/AuthController.java → backend/src/main/java/com/sentinel/models/User.java
- `ServiceController` --references--> `MonitoredService`  [EXTRACTED]
  backend/src/main/java/com/sentinel/controllers/ServiceController.java → backend/src/main/java/com/sentinel/models/MonitoredService.java

## Communities (31 total, 15 thin omitted)

### Community 2 - "Frontend State & Dashboard"
Cohesion: 0.33
Nodes (6): authSlice, Dashboard, fleetSlice, Home, Project Progress, ServiceCard

### Community 9 - "Telemetry Engine"
Cohesion: 0.5
Nodes (4): ApiMonitor, MonitoredService, PingLog, ServiceController

### Community 11 - "Core UI Layout"
Cohesion: 0.67
Nodes (3): App, DarkVeil, Navbar

## Knowledge Gaps
- **17 isolated node(s):** `ServiceStatusDTO`, `MonitoredService`, `PingLog`, `User`, `SentinelApplication` (+12 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ApiMonitor` connect `Authentication & User Management` to `Service Repositories`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `ServiceStatusDTO`, `MonitoredService`, `PingLog` to the rest of the system?**
  _17 weakly-connected nodes found - possible documentation gaps or missing edges._