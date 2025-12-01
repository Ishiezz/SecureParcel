# SecureParcel
> **Secure, Asynchronous Delivery.**

## 📌 Problem Statement
On university campuses, students often face significant challenges with online deliveries. Orders get delayed, canceled, or missed because students are stuck in classes, have poor internet connectivity, or are unavailable to meet delivery agents. This leads to inconvenience for both students and delivery partners.

## 💡 Solution
**SecureParcel** is a mobile application designed to bridge the gap between students, delivery partners, and campus security. It facilitates a secure and convenient delivery system using designated campus compartments (smart lockers).

The workflow is simple:
1.  **Delivery Partners** deposit packages into secure slots and generate a unique OTP.
2.  **Students** receive an instant notification with the OTP and slot details.
3.  **Security Guards** verify the OTP and student identity (via biometrics) before allowing collection.

This ensures packages are stored safely until students can collect them at their own convenience.

### ℹ️ Why "Asynchronous"?
**"Asynchronous"** is a technical term meaning "not happening at the same time." In the context of SecureParcel, it perfectly describes the core value proposition:

*   **The Problem (Synchronous)**: Traditionally, a delivery agent calls you, and you *must* be physically present at that exact moment to receive the package. If you are in class or busy, you miss the delivery.
*   **The Solution (Asynchronous)**: The delivery agent deposits the parcel in a secure locker at **10:00 AM**. You collect it at **4:00 PM**. The drop-off and collection happen at completely different times, eliminating the need to coordinate schedules or meet in person.

## 🚀 Key Features
-   **Role-Based Access**: Dedicated interfaces for Students, Delivery Partners, and Security Guards.
-   **Secure Compartment System**: Slot management for organizing deliveries.
-   **OTP Verification**: Two-factor authentication style security for package handover.
-   **Biometric Integration**: Identity verification for an added layer of security (Simulated).
-   **Real-time Notifications**: Instant updates for students when a package arrives.

## 📱 User Flows
### 1. Delivery Partner
-   Log in and select "Deposit Package".
-   Enter Student details and Courier service (e.g., Amazon, Flipkart).
-   Assign a Compartment Slot.
-   **Generate OTP** and deposit the parcel.

### 2. Student
-   View a dashboard of pending deliveries.
-   See the assigned Slot Number and Collection OTP.
-   Visit the collection point at a convenient time.

### 3. Security Guard
-   Verify the Student's OTP against the package details.
-   Perform Biometric Verification (Simulated).
-   Mark the package as "Collected" to free up the slot.

## 🛠️ Tech Stack
-   **Frontend**: React Native (Expo)
-   **Navigation**: React Navigation (Native Stack)
-   **State Management**: React Context API
-   **UI Components**: Custom Styles & Vector Icons

## 🏃‍♂️ How to Run
1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start the App**:
    ```bash
    npx expo start
    ```
3.  **Test**:
    -   Scan the QR code with the Expo Go app (Android/iOS).
    -   Or press `i` for iOS Simulator / `a` for Android Emulator.

---
*SecureParcel - Making missed deliveries a thing of the past.*
