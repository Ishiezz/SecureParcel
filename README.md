<div align="center">
  <h1>📦 SecureParcel</h1>
  <p><strong>Enterprise-Grade Campus Locker & Parcel Delivery Ecosystem</strong></p>

  [![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![React Native](https://img.shields.io/badge/Framework-React%20Native-61DAFB.svg?style=for-the-badge&logo=react)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Platform-Expo%20SDK%2054-000020.svg?style=for-the-badge&logo=expo)](https://expo.dev/)
  [![Node.js](https://img.shields.io/badge/Backend-Node.js-339933.svg?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
  [![Socket.io](https://img.shields.io/badge/Realtime-Socket.io-010101.svg?style=for-the-badge&logo=socketdotio)](https://socket.io/)
  [![Firebase](https://img.shields.io/badge/Database-Firebase-FFCA28.svg?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
</div>

---

## 📖 Overview

**SecureParcel** is a real-time, highly secure campus locker management and parcel delivery platform. It bridges the gap between students, delivery couriers, and campus security through a unified ecosystem. Built with a decoupled microservice-like architecture, SecureParcel delivers an ultra-smooth mobile experience backed by a resilient Node.js infrastructure, real-time WebSocket synchronization, and a smart cascading AI assistant.

Whether managing high-volume package influxes or ensuring airtight parcel handovers via dynamic, time-sensitive QR codes, SecureParcel is designed for scale, speed, and absolute security.

---

## ✨ Key Features

### 👤 Role-Based Portals
- **Student Hub:** Real-time package tracking, interactive locker map, instant AI chat support, and dynamic retrieval QR generation.
- **Delivery Courier Station:** Streamlined parcel registration, intelligent locker allocation, and integrated photo-proof of delivery.
- **Guard Verification Station:** Dedicated scanning interface with instant JWT validation and automated locker door release signaling.

### 🔒 Zero-Trust Security & Dynamic QR
- **Time-Sensitive QR Codes:** Retrieval codes auto-regenerate every 30 seconds with encrypted payload signatures, preventing unauthorized screenshot sharing.
- **Biometric Authentication:** Native FaceID/TouchID integration ensures that only the authorized user can view secure pickup credentials.
- **Defense-in-Depth Backend:** Express APIs hardened with rate limiters, Helmet headers, CORS filters, and strict role-based access control (RBAC).

### 🤖 Resilient AI Assistant
- **Cascading LLM Architecture:** Designed for 100% uptime with automated fallback routing (Groq ⚡️ → OpenAI GPT-4o 🧠 → Google Gemini Pro 🌐).
- **Context-Aware Responses:** The AI reads real-time locker occupancy and parcel state to provide highly accurate, contextual assistance to users.
- **Offline Mock Fallbacks:** Built-in smart NLP failovers ensure the assistant remains functional even during API outages.

### ⚡️ Real-Time & Offline-Ready
- **Instant Synchronization:** Powered by Socket.io and Firebase Firestore, state changes (like a parcel deposit) instantly push to all connected clients.
- **Optimized Offline Experience:** Zustand state management seamlessly handles network drops with 1.5s safety timeouts, loading rich cached data environments to prevent application hangs.

---

## 🏗 System Architecture

SecureParcel leverages a modern, distributed topology ensuring clean separation of concerns.

```mermaid
graph TD
    subgraph Mobile_Application ["📱 React Native Expo Client"]
        SP[Student Portal]
        DP[Delivery Portal]
        GP[Guard Scan Station]
        Zustand[Zustand Store Manager]
    end

    subgraph Native_Sensors ["🛠 Hardware / Native Bindings"]
        Bio[Biometric Auth]
        Cam[Expo Camera Scanner]
        Hap[Haptic Engine]
    end

    subgraph Backend_Infrastructure ["⚙️ Node.js + TS Express Server"]
        API[Secure REST API]
        WS[Socket.io Real-time Server]
        AuthMid[Firebase JWT Auth]
        AIEng[AI Orchestrator]
    end

    subgraph Cloud_Providers ["☁️ Cloud Services"]
        FB[Firebase Firestore & Auth]
        Push[Expo Push Notifications]
        LLM[Groq / OpenAI / Gemini]
    end

    %% Client Internals
    SP --> Zustand
    DP --> Zustand
    GP --> Zustand
    Zustand --> Bio
    GP --> Cam
    Zustand --> Hap

    %% Network flows
    Mobile_Application <--> |HTTPS + JWT| API
    Mobile_Application <--> |WebSocket| WS

    %% Cloud flows
    API <--> FB
    WS <--> FB
    API --> Push
    API <--> AIEng
    AIEng <--> LLM
```

---

## 🛠 Technology Stack

### Mobile Client
* **Framework:** React Native, Expo SDK 54
* **Language:** TypeScript
* **State Management:** Zustand (Multi-store architecture)
* **Animations & UI:** React Native Reanimated, Custom Glassmorphism
* **Integrations:** Expo Camera, Local Authentication, Haptics

### Backend Server
* **Environment:** Node.js
* **Framework:** Express.js (TypeScript)
* **Real-time Engine:** Socket.io
* **Authentication:** Firebase Admin SDK (JWT Validation)
* **Security:** Helmet, express-rate-limit, cors

### Database & Cloud
* **Database:** Firebase Firestore
* **Notifications:** Expo Push Notifications Servers
* **AI Providers:** Groq, OpenAI, Google Gemini

### Telemetry & Analytics
* **Crash Reporting:** Sentry SDK
* **User Analytics:** Mixpanel
* **Monetization/IAP:** RevenueCat

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* Expo CLI (`npm install -g expo-cli`)
* Firebase Project Setup

### 1. Repository Setup
```bash
git clone https://github.com/AyushCoder9/SecPar-ish.git
cd SecPar-ish
```

### 2. Environment Configuration
Duplicate the provided `.env.example` to `.env` in both the root directory and the `backend` directory.

**Backend Configuration (`backend/.env`):**
```env
PORT=5000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# AI Configuration
GROQ_API_KEY=your-groq-key
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key
```

**Frontend Configuration (`.env`):**
```env
EXPO_PUBLIC_API_URL=http://localhost:5000
EXPO_PUBLIC_SENTRY_DSN=your-sentry-dsn
EXPO_PUBLIC_MIXPANEL_TOKEN=your-mixpanel-token
EXPO_PUBLIC_RC_APPLE_KEY=your-revenuecat-apple-key
EXPO_PUBLIC_RC_GOOGLE_KEY=your-revenuecat-google-key
```

### 3. Running the Application

**Start the Node.js Backend Server:**
```bash
cd backend
npm install
npm run dev
```
*Server runs on `http://localhost:5000` with hot-reloading.*

**Start the React Native Expo Client:**
```bash
# From the project root
npm install
npx expo start
```
*Use the Expo Go app on your iOS or Android device to scan the QR code, or launch the iOS Simulator/Android Emulator.*

---

## 🧪 Development & Tooling

**Type Checking:**
Run strict TypeScript validation across the project:
```bash
npx tsc --noEmit
```

**Production Build (Backend):**
Compile the backend for production deployment:
```bash
cd backend
npm run build
npm start
```
