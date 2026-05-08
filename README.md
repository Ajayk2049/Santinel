# 🛡️ SENTINEL | Real-Time API Fleet Monitor

![SENTINEL Banner](https://img.shields.io/badge/MISSION-CRITICAL-14b8a6?style=for-the-badge)
![Status](https://img.shields.io/badge/STATUS-OPERATIONAL-success?style=for-the-badge)
![Backend](https://img.shields.io/badge/SPRING--BOOT-3.x-green?style=for-the-badge&logo=spring)
![Frontend](https://img.shields.io/badge/REACT-18.x-blue?style=for-the-badge&logo=react)

Sentinel is a high-performance, mission-critical API monitoring platform designed for real-time fleet surveillance. It provides DevOps teams and SREs with a premium "Mission Control" interface to track the health, latency, and uptime of distributed microservices.

---

## 📸 Interface Preview

<p align="center">
  <img src="Screenshots/1.png" width="45%" alt="Sentinel Mission Control" />
  <img src="Screenshots/2.png" width="45%" alt="Fleet Surveillance Grid" />
</p>
<p align="center">
  <img src="Screenshots/3.png" width="45%" alt="Advanced Protocol Configuration" />
  <img src="Screenshots/4.png" width="45%" alt="Intelligence Extraction" />
</p>
<p align="center">
  <img src="Screenshots/5.png" width="45%" alt="Operator Login" />
  <img src="Screenshots/6.png" width="45%" alt="Registration Portal" />
</p>

---

## 🚀 Project Philosophy & Use Case

In modern microservice architectures, API reliability is paramount. **Sentinel** was built to bridge the gap between simple "ping" scripts and complex, expensive enterprise monitoring suites.

### Core Use Cases:
*   **Real-Time Surveillance**: Monitor critical endpoints (Auth, Payment, Search) with sub-minute precision.
*   **Incident Deep-Dive**: Use the **Intelligence Modal** to parse response payloads (JSON/Images) and identify the root cause of failures.
*   **Fleet Management**: Organize and filter large numbers of services based on healthy vs. incident states.
*   **Uptime Stability Tracking**: Calculate long-term reliability scores based on the last 100 surveillance pulses.

---

## 🛠️ Tech Stack & Architecture

### 🌌 Backend (Spring Boot Infrastructure)
The backend is a robust Java-based engine built on **Spring Boot 3**, leveraging a multi-threaded polling architecture.
*   **Polling Engine (`ApiMonitor.java`)**: A specialized component utilizing `TaskScheduler` to manage independent threads for every registered service.
*   **REST API Layer**: Controllers built with Spring Web to provide paginated incident logs and real-time fleet status.
*   **Security Context**: Stateless JWT authentication with a custom `JwtTokenFilter` and BCrypt password encryption.
*   **Persistence**: MongoDB Atlas integration using `Spring Data MongoDB` for time-series ping logging.

### 🌓 Frontend (React Operations)
A premium "Dark Veil" aesthetic built for high-density information display.
*   **Mission Control Dashboard**: A responsive grid-based UI utilizing **Framer Motion** for status-driven animations.
*   **State Management**: **Redux Toolkit** handles the global fleet state, ensuring real-time UI updates as the surveillance engine reports back.
*   **Intelligence Extraction**: A specialized React component that detects image URLs and structured JSON (like titles/bodies) within raw API responses.

---

## 📂 Project Structure

```text
Santinel/
├── backend/                # Spring Boot 3 + MongoDB Atlas
│   ├── src/main/java/      # Core logic (Repositories, Security, Controllers)
│   │   ├── config/         # Security & CORS configuration
│   │   ├── engine/         # ApiMonitor (The Heart of Sentinel)
│   │   ├── models/         # MongoDB Documents (User, Service, PingLog)
│   │   └── controllers/    # API Endpoints
│   └── src/main/resources/ # Configuration & Logback setup
├── frontend/               # React 18 + Vite + Redux
│   ├── src/components/     # Modular UI (ServiceCard, IntelligenceModal)
│   ├── src/pages/          # Main Views (Dashboard, Auth, Home)
│   ├── src/store/          # Redux Slices & Async Thunks
│   └── src/hooks/          # Custom Hooks (usePolling)
└── progress.md             # Development activity log
```

---

## ⚡ Setup & Initialization

### 1. Prerequisites
- **Java 17+** Installed
- **Node.js 18+** Installed
- **MongoDB Atlas** Account

### 2. Backend Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=5500
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_random_key
```

**Launch Backend:**
```powershell
cd backend
./mvnw spring-boot:run
```

### 3. Frontend Configuration
```powershell
cd frontend
npm install
npm run dev
```

---

## 🛰️ Core System Features

### 📡 Surveillance Engine
The engine pings registered endpoints using Java's `HttpClient`. It records latency, status codes, and the full raw payload. It automatically reschedules polling threads when a service's interval is updated via the dashboard.

### 🧠 Intelligence Modal
A tabbed analysis tool that separates **Raw Data** from **Intelligence Data**. It uses smart extraction to render images from APIs (like Dog CEO) or clean lists of content (like JSONPlaceholder posts), providing instant visual feedback on API health.

### 🛡️ Secure Auth Portal
Stateless JWT authentication ensures that only authorized operators can modify the surveillance fleet. The system supports browser-native password management and persistent sessions.

---

*Sentinel | Real-Time Fleet Monitor & Incident Tracker | 2026*
