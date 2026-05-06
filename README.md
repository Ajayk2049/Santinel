# 🛡️ SENTINEL | Real-Time API Fleet Monitor

![SENTINEL Banner](https://img.shields.io/badge/MISSION-CRITICAL-14b8a6?style=for-the-badge)
![Status](https://img.shields.io/badge/STATUS-OPERATIONAL-success?style=for-the-badge)

Sentinel is a high-performance, mission-critical API monitoring platform designed for real-time fleet surveillance. It pings external endpoints at scheduled intervals, logs telemetry data (latency, status codes, uptime), and serves this data to a premium, WebGL-enhanced dashboard.

---

## 📸 Interface Preview

<p align="center">
  <img src="Screenshots/1.png" width="45%" alt="Sentinel Landing" />
  <img src="Screenshots/4.png" width="45%" alt="Mission Control Dashboard" />
</p>
<p align="center">
  <img src="Screenshots/3.png" width="45%" alt="Operator Login" />
  <img src="Screenshots/2.png" width="45%" alt="Join the Fleet" />
</p>

---

## 🛠️ Tech Stack

### Backend Infrastructure
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

### Frontend Operations
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

#### 🎨 Design & Animation
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![OGL WebGL](https://img.shields.io/badge/OGL_WebGL-990000?style=for-the-badge&logo=webgl&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide_Icons-FF0066?style=for-the-badge&logo=lucide&logoColor=white)
![Phosphor Icons](https://img.shields.io/badge/Phosphor_Icons-888888?style=for-the-badge&logo=phosphor-icons&logoColor=white)

#### 🧩 Shadcn UI & Utilities
![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-161616?style=for-the-badge&logo=radix-ui&logoColor=white)
![CVA](https://img.shields.io/badge/Class_Variance_Authority-teal?style=for-the-badge)
![Clsx](https://img.shields.io/badge/Clsx-blue?style=for-the-badge)
![Tailwind Merge](https://img.shields.io/badge/Tailwind_Merge-orange?style=for-the-badge)
![Tailwind Animate](https://img.shields.io/badge/Tailwind_Animate-purple?style=for-the-badge)
![TW Animate CSS](https://img.shields.io/badge/TW_Animate_CSS-yellow?style=for-the-badge)

#### 🔡 Typography
![Fontsource](https://img.shields.io/badge/Merriweather-grey?style=for-the-badge&logo=fontsource)
![Fontsource](https://img.shields.io/badge/Noto_Sans-grey?style=for-the-badge&logo=fontsource)

---

## 📈 Technical Specifications

### Telemetry & Logging
The system maintains a dual-layer logging strategy:
- **System Logs**: Located in `backend/logs/`, tracking all Spring Boot internal operations.
- **Incident Logs**: Stored in MongoDB, providing historical data for every registered API endpoint, accessible via the dashboard's telemetry view.

---

## 📂 Project Structure

```text
Santinel/
├── backend/                # Spring Boot 3 + MongoDB Atlas
│   ├── src/main/java/      # Core logic (Polling Engine, Auth, Controllers)
│   ├── src/main/resources/ # Configuration & Logback setup
│   ├── logs/               # Persistent system logs
│   └── .env                # Backend environment secrets
├── frontend/               # React 18 + Vite + Redux
│   ├── src/components/     # UI Components (DarkVeil, Navbar, etc.)
│   ├── src/pages/          # Main Views (Home, Auth, Dashboard)
│   ├── src/store/          # Redux State Management
│   └── public/             # Static assets (Favicons, etc.)
├── progress.md             # Mandatory activity logging (Internal)
└── README.md               # Master Project Documentation
```

---

## ⚡ Setup & Initialization

### 1. Prerequisites
- **Java 17+** Installed
- **Node.js 18+** Installed
- **MongoDB Atlas** Account (for cloud persistence)

### 2. Backend Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=5500
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_random_key (or leave empty for auto-gen)
```

**Launch Terminal:**
```powershell
cd backend
./mvnw spring-boot:run
```

### 3. Frontend Configuration
Install dependencies and initiate the development server:
```powershell
cd frontend
npm install
npm run dev
```

---

## 🛰️ Core Systems

### Polling Engine
The backend utilizes a multi-threaded `@Scheduled` engine to ping registered API endpoints every 60 seconds. It records:
- **Latency**: Precise response time in milliseconds.
- **Status Codes**: 2xx (Success), 4xx/5xx (Incidents).
- **History**: Time-series data for incident tracking.

### Auth Portal
- **JWT-Based**: Secure stateless authentication.
- **Google Protocol**: Frontend supports browser-native strong password suggestions during signup.
- **Dynamic Identity**: Navbar extracts and displays operator handles from session tokens.

---

*Sentinel | Real-Time Fleet Monitor & Incident Tracker | 2026*
