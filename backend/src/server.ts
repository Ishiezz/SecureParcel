import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'http';

import { connectDB } from './config/database';
import { initFirebaseAdmin } from './config/firebaseAdmin';
import { initSocketServer } from './services/socketService';
import { initAIProviders } from './services/aiService';

import { generalLimiter, errorHandler, notFoundHandler } from './middleware/rateLimiter';

import authRoutes from './routes/auth';
import packageRoutes from './routes/packages';
import lockerRoutes from './routes/lockers';
import notificationRoutes from './routes/notifications';
import aiRoutes from './routes/ai';

// Load env vars
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Initialize Services
initFirebaseAdmin();
initSocketServer(httpServer);
initAIProviders();

// Middleware
app.use(helmet()); // Security headers
app.use(cors());
app.use(compression()); // Compress responses
app.use(express.json());
app.use(generalLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/lockers', lockerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);

// Base route
app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'SecureParcel API Running',
        status: 'Operational'
    });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start Server
const startServer = async () => {
    await connectDB();
    httpServer.listen(PORT, () => {
        console.log(`[Server] SecureParcel API listening on port ${PORT}`);
    });
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('[Server] Shutting down gracefully...');
    httpServer.close();
    process.exit(0);
});
