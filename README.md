# SecureParcel 📦

> **Secure, Asynchronous Delivery for Campuses.**

## 📌 Problem Statement
On university campuses, students often face significant challenges with online deliveries. Orders get delayed, canceled, or missed because students are stuck in classes, have poor internet connectivity, or are unavailable to meet delivery agents. This leads to inconvenience for both students and delivery partners.

## 💡 Solution
**SecureParcel** is a mobile application designed to bridge the gap between students, delivery partners, and campus security. It facilitates a secure and convenient delivery system using designated campus compartments (smart lockers).

### ℹ️ Why "Asynchronous"?
**"Asynchronous"** means "not happening at the same time."
*   **Traditional (Synchronous)**: You must meet the delivery agent at the exact moment they arrive in campus or college.
*   **SecureParcel (Asynchronous)**: The agent drops the parcel at **10:00 AM**. You collect it at **4:00 PM**. No coordination needed.

---

## � Current Features (v1.0 - UI & Frontend Logic)
The current version of the application features a complete, polished User Interface and frontend logic built with React Native (Expo).

### 🔐 Authentication & Security
-   **Secure Login/Signup**: Beautifully designed auth screens with form validation.
-   **Role-Based Access Control**: Distinct flows for **Students**, **Delivery Partners**, and **Security Guards**.
-   **Biometric Simulation**: UI for fingerprint verification.

### 🎓 Student Portal
-   **Dashboard**: View active deliveries and assigned locker slots.
-   **Package History**: Track past deliveries with status updates.
-   **Profile Management**: Manage personal details and settings.
-   **Notifications**: UI for receiving delivery alerts.

### 🚚 Delivery Partner Portal
-   **Deposit Interface**: Streamlined UI for entering student details and assigning lockers.
-   **OTP Generation**: Logic to generate secure pickup codes.

### 🛡️ Security Guard Portal
-   **Verification Dashboard**: Tools to verify student identity and OTPs before package release.

---

## 🔮 Future Roadmap (Backend & Real-time)
We are actively working on the backend integration to bring the application to life with real-time data.

-   [ ] **Backend Integration**: Connect the Express.js/MongoDB backend to replace local state/mock data.
-   [ ] **Real-time Socket.io**: Implement live updates so students get notified instantly when a package is deposited.
-   [ ] **Physical Locker Integration**: APIs to control smart locker locks (IoT integration).
-   [ ] **Push Notifications**: Integrate Expo Notifications for system-wide alerts.
-   [ ] **Production Biometrics**: Connect the simulated UI to actual device hardware (TouchID).

---

## 🛠️ Tech Stack

### Frontend (Current)
-   **Framework**: React Native (Expo SDK 54)
-   **Navigation**: React Navigation (Native Stack)
-   **Styling**: Custom Styles, React Native Paper, Vector Icons
-   **State Management**: React Context API

### Backend (In Progress)
-   **Runtime**: Node.js & Express.js
-   **Database**: MongoDB (Mongoose)
-   **Real-time**: Socket.io

---

## 📂 Project Structure
```
SecureParcel/
├── src/                # React Native Frontend
│   ├── screens/        # App Screens
│   │   ├── Auth/       # Login, Signup, Forgot Password
│   │   ├── Student/    # Dashboard, History, Profile
│   │   ├── Delivery/   # Delivery Dashboard
│   │   └── Guard/      # Guard Dashboard
│   ├── context/        # Global State (Auth, Theme)
│   └── navigation/     # App Navigation Setup
├── backend/            # Node.js API (Skeleton)
└── assets/             # Images and Icons
```

---

## 🏃‍♂️ Getting Started

### Prerequisites
-   **Node.js** & **npm**
-   **Expo Go** app on your phone.

### Setup Instructions
1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start the App**:
    ```bash
    npx expo start
    ```
3.  **Run on Device**:
    -   Scan the QR code with **Expo Go**.
    -   Press `i` for iOS Simulator or `a` for Android Emulator.

---

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License
This project is licensed under the 0BSD License.
