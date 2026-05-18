import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';

let io: SocketIOServer | null = null;

const JWT_SECRET = process.env.JWT_SECRET || 'secureparcel-dev-secret-key-change-in-prod';

export const initSocketServer = (httpServer: HttpServer) => {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: '*', // Adjust in prod
            methods: ['GET', 'POST']
        }
    });

    const parcelsNamespace = io.of('/parcels');

    // Authentication middleware for sockets
    parcelsNamespace.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }

        try {
            if (token === 'mock-token' && process.env.NODE_ENV !== 'production') {
                socket.data.user = { uid: 'mock', role: 'student' };
                return next();
            }
            
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            socket.data.user = decoded;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    parcelsNamespace.on('connection', (socket) => {
        console.log(`[Socket] Client connected: ${socket.id} (User: ${socket.data.user?.uid})`);

        // Join role-specific or user-specific rooms
        if (socket.data.user?.role === 'student') {
            socket.join(`student:${socket.data.user.id}`);
        } else if (socket.data.user?.role === 'guard') {
            socket.join('guards');
        }

        socket.on('disconnect', () => {
            console.log(`[Socket] Client disconnected: ${socket.id}`);
        });
    });

    console.log('[Socket] Server initialized');
};

export const getSocketServer = () => {
    if (!io) {
        console.warn('[Socket] Socket.io not initialized yet');
        return null;
    }
    return io.of('/parcels');
};
