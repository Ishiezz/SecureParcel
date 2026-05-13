// ============================================================
// Socket.io Client Service — Real-time events with fallback
// ============================================================

type SocketEventCallback = (data: any) => void;
import { useAuthStore } from '../store/useAuthStore';

let socket: any = null;
let socketEnabled = false;
const listeners: Map<string, SocketEventCallback[]> = new Map();

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5050';

export const connectSocket = async (token: string) => {
    try {
        const { io } = await import('socket.io-client');
        socket = io(`${BASE_URL}/parcels`, {
            auth: { token },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        });

        socket.on('connect', () => {
            socketEnabled = true;
            console.log('[Socket] Connected:', socket.id);
        });

        socket.on('disconnect', () => {
            socketEnabled = false;
            console.log('[Socket] Disconnected');
        });

        socket.on('connect_error', (err: Error) => {
            console.warn('[Socket] Connection error — real-time updates unavailable:', err.message);
            socketEnabled = false;
        });

        // Forward all registered events
        ['package:deposited', 'package:collected', 'package:verified', 'locker:updated'].forEach(event => {
            socket.on(event, (data: any) => {
                const cbs = listeners.get(event) || [];
                cbs.forEach(cb => cb(data));
            });
        });
    } catch {
        console.log('[Socket] socket.io-client unavailable — polling fallback active');
    }
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        socketEnabled = false;
    }
    listeners.clear();
};

export const onSocketEvent = (event: string, callback: SocketEventCallback) => {
    if (!listeners.has(event)) listeners.set(event, []);
    listeners.get(event)!.push(callback);
};

export const offSocketEvent = (event: string, callback?: SocketEventCallback) => {
    if (!callback) {
        listeners.delete(event);
    } else {
        const cbs = listeners.get(event) || [];
        listeners.set(event, cbs.filter(cb => cb !== callback));
    }
};

export const emitSocketEvent = (event: string, data: any) => {
    if (socket && socketEnabled) {
        socket.emit(event, data);
    }
};

export const isSocketConnected = () => socketEnabled;

export const socketService = {
    connect: () => {
        const token = useAuthStore.getState().token;
        if (token) {
            connectSocket(token);
        }
    },
    disconnect: () => {
        disconnectSocket();
    }
};
