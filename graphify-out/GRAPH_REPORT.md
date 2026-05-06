# Graph Report - .  (2026-05-06)

## Corpus Check
- Corpus is ~7,854 words - fits in a single context window. You may not need a graph.

## Summary
- 80 nodes · 52 edges · 30 communities (13 shown, 17 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.9)
- Token cost: 1,200 input · 800 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Service Fleet Management|Service Fleet Management]]
- [[_COMMUNITY_Security & Auth Config|Security & Auth Config]]
- [[_COMMUNITY_Core System Rationale|Core System Rationale]]
- [[_COMMUNITY_Authentication API|Authentication API]]
- [[_COMMUNITY_Telemetry Engine|Telemetry Engine]]
- [[_COMMUNITY_Service Persistence|Service Persistence]]
- [[_COMMUNITY_Telemetry Persistence|Telemetry Persistence]]
- [[_COMMUNITY_User Persistence|User Persistence]]
- [[_COMMUNITY_Theme & Global State|Theme & Global State]]
- [[_COMMUNITY_Dashboard Logic|Dashboard Logic]]
- [[_COMMUNITY_Application Entrypoint|Application Entrypoint]]
- [[_COMMUNITY_Data Transfer Objects|Data Transfer Objects]]
- [[_COMMUNITY_Fleet Models|Fleet Models]]
- [[_COMMUNITY_Telemetry Models|Telemetry Models]]
- [[_COMMUNITY_User Models|User Models]]
- [[_COMMUNITY_Project Identity|Project Identity]]
- [[_COMMUNITY_Auth Portal Semantic|Auth Portal Semantic]]
- [[_COMMUNITY_Brand Assets|Brand Assets]]

## God Nodes (most connected - your core abstractions)
1. `ServiceController` - 5 edges
2. `SecurityConfig` - 4 edges
3. `AuthController` - 3 edges
4. `TelemetryEngineService` - 3 edges
5. `MonitoredServiceRepository` - 3 edges
6. `PingLogRepository` - 3 edges
7. `UserRepository` - 3 edges
8. `SentinelApplication` - 2 edges
9. `ThemeProvider()` - 2 edges
10. `usePolling()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Sentinel Hero Image` --conceptually_related_to--> `DarkVeil UI`  [INFERRED]
  frontend/src/assets/hero.png → README.md
- `Polling Engine` --implements--> `Dual-Layer Logging Strategy`  [EXTRACTED]
  backend/src/main/java/com/sentinel/engine/TelemetryEngineService.java → README.md
- `Mission Control Dashboard` --implements--> `DarkVeil UI`  [EXTRACTED]
  frontend/src/pages/Dashboard.jsx → README.md
- `Sentinel API Fleet Monitor` --implements--> `Real-Time Fleet Monitoring`  [INFERRED]
  README.md → progress.md
- `Mission Control Dashboard` --references--> `Polling Engine`  [EXTRACTED]
  frontend/src/pages/Dashboard.jsx → backend/src/main/java/com/sentinel/engine/TelemetryEngineService.java

## Communities (30 total, 17 thin omitted)

### Community 3 - "Core System Rationale"
Cohesion: 0.4
Nodes (5): DarkVeil UI, Sentinel Hero Image, Mission Control Dashboard, Polling Engine, Dual-Layer Logging Strategy

## Knowledge Gaps
- **10 isolated node(s):** `ServiceStatusDTO`, `MonitoredService`, `PingLog`, `User`, `Sentinel API Fleet Monitor` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `ServiceStatusDTO`, `MonitoredService`, `PingLog` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._