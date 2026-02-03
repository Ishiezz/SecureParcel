const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Configure Environment Variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Don't exit process in dev, just log error mostly in case of missing env
        // process.exit(1); 
    }
};

// Routes
app.get('/', (req, res) => {
    res.send('SecureParcel Backend is Running...');
});

// Start Server
const PORT = process.env.PORT || 5000;

// Connect to DB then start server (or just start if no DB for now)
if (process.env.MONGO_URI) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
} else {
    // Fallback for development/testing without DB string
    console.warn('MONGO_URI not found in .env, starting server without DB connection.');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
