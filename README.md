SecureParcel 📦
A smart campus parcel management system that enables students to securely receive packages without scheduling conflicts.

🎯 The Problem
College students face constant challenges with parcel deliveries:

📚 Class schedules clash with delivery timings
📞 Missed calls due to network issues or classes
🏃‍♂️ Unavailable when delivery personnel arrive
❌ Orders get cancelled due to failed deliveries
🔒 Security concerns with unattended packages

💡 Our Solution
SecureParcel provides a secure locker-based system where:

📦 Delivery personnel safely store parcels in secure lockers
🔔 Students receive instant notifications upon delivery
📱 QR code-based access for flexible pickup
⏰ 24/7 parcel collection at student's convenience
✅ No more missed deliveries or cancelled orders

✨ Key Features

For Students
Real-time Tracking - Monitor parcel status from delivery to pickup
Instant Notifications - Get alerted when parcels arrive
QR Code Access - Secure locker opening with mobile scanning
Flexible Pickup - Collect parcels anytime that suits you
Delivery History - Track all your past parcels

For Delivery Personnel
Quick Drop-off - Efficient parcel storage process
Digital Documentation - Paperless delivery confirmation
Student Database - Easy recipient identification
Status Updates - Real-time delivery confirmation

🛠️ Technology Stack
Frontend:

React Native with TypeScript
Redux Toolkit for state management
NativeBase for UI components
React Navigation for routing

Backend:

Node.js with Express.js
MongoDB for database
JWT for authentication
Socket.io for real-time updates

🚀 Getting Started
Prerequisites
Node.js (v18 or higher)
MongoDB installed locally
Android Studio / Xcode for emulators

Installation
1.Clone the repository
  git clone https://github.com/your-username/secureparcel.git
  cd secureparcel
2.Install dependencies
  # Install frontend dependencies
    npm install
  
  # Install backend dependencies
    cd backend
    npm install
3.Environment Setup
  # Copy environment file and configure
    cp .env.example .env
4.Start the Application
 # Terminal 1 - Start backend server
    cd backend
    npm run dev
 # Terminal 2 - Start frontend development server
    npm start

📱 App Screens

1.Authentication - Student login and registration
2.Dashboard - Overview of current and past parcels
3.Parcel Tracking - Real-time delivery status updates
4.QR Scanner - Secure locker access interface
5.Notifications - Delivery alerts and updates

🏗️ Project Structure

secureparcel/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Application screens
│   ├── navigation/         # App routing configuration
│   ├── store/              # Redux state management
│   ├── services/           # API services and utilities
│   └── assets/             # Images and static files
├── backend/
│   ├── models/             # MongoDB data models
│   ├── routes/             # API route definitions
│   ├── controllers/        # Business logic handlers
│   └── middleware/         # Custom middleware functions
└── docs/                   # Project documentation

🔧 Configuration
1.Database Setup

  Install MongoDB Community Edition
  Create a database named secureparcel
  Update the connection string in your .env file

2.Optional: Push Notifications

  Create a Firebase project
  Enable Cloud Messaging for push notifications
  Configure Firebase credentials in the app

👨‍💻 Development
This project is developed as a college project to solve real-world campus delivery challenges. The focus is on creating a practical solution that addresses the specific problems faced by students in managing parcel deliveries.

🤝 Feedback
As a college project, we welcome feedback and suggestions for improvement. Feel free to open issues for any bugs or share ideas for enhancing the solution.

<div align="center">
Built with ❤️ for College Students
Solving real campus problems with technology
</div>
