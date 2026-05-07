# Graph Report - ./frontend  (2026-05-07)

## Corpus Check
- 27 files · ~6,215 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 104 nodes · 85 edges · 33 communities (19 shown, 14 thin omitted)
- Extraction: 85% EXTRACTED · 15% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Service Monitoring Backend|Service Monitoring Backend]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Frontend Layout & Navigation|Frontend Layout & Navigation]]
- [[_COMMUNITY_Dashboard & State Management|Dashboard & State Management]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Core Monitoring Logic|Core Monitoring Logic]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 32|Community 32]]

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
- `SentinelApplication` --references--> `Sentinel README`  [INFERRED]
  backend/src/main/java/com/sentinel/SentinelApplication.java → README.md
- `Dashboard` --references--> `Project Progress`  [INFERRED]
  frontend/src/pages/Dashboard.jsx → progress.md
- `usePolling()` --calls--> `Dashboard()`  [INFERRED]
  frontend/src/hooks/usePolling.js → frontend/src/pages/Dashboard.jsx
- `AuthController` --references--> `User`  [EXTRACTED]
  backend/src/main/java/com/sentinel/controllers/AuthController.java → backend/src/main/java/com/sentinel/models/User.java
- `ServiceController` --references--> `MonitoredService`  [EXTRACTED]
  backend/src/main/java/com/sentinel/controllers/ServiceController.java → backend/src/main/java/com/sentinel/models/MonitoredService.java

## Communities (33 total, 14 thin omitted)

### Community 0 - "Service Monitoring Backend"
Cohesion: 0.17
Nodes (3): ServiceController, ApiMonitor, PingLogRepository

### Community 2 - "Frontend Layout & Navigation"
Cohesion: 0.32
Nodes (5): DarkVeil, Navbar, App(), AppContent(), ProtectedRoute()

### Community 3 - "Dashboard & State Management"
Cohesion: 0.33
Nodes (6): authSlice, Dashboard, fleetSlice, Home, Project Progress, ServiceCard

### Community 8 - "Core Monitoring Logic"
Cohesion: 0.5
Nodes (4): ApiMonitor, MonitoredService, PingLog, ServiceController

## Knowledge Gaps
- **17 isolated node(s):** `ServiceStatusDTO`, `MonitoredService`, `PingLog`, `User`, `SentinelApplication` (+12 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ApiMonitor` connect `Service Monitoring Backend` to `Community 5`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `ServiceStatusDTO`, `MonitoredService`, `PingLog` to the rest of the system?**
  _17 weakly-connected nodes found - possible documentation gaps or missing edges._