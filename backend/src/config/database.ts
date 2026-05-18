import mongoose, { ConnectOptions } from 'mongoose';

let retryCount = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

export const connectDB = async (): Promise<boolean> => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.warn('[DB] MONGO_URI not set — running without MongoDB');
        return false;
    }

    const connect = async (): Promise<boolean> => {
        try {
            await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 5000,
                maxPoolSize: 10,
                socketTimeoutMS: 45000,
                family: 4,
            } as ConnectOptions);

            retryCount = 0;
            console.log(`[DB] MongoDB connected: ${mongoose.connection.host}`);

            mongoose.connection.on('error', (err) => {
                console.error('[DB] Connection error:', err.message);
            });

            mongoose.connection.on('disconnected', () => {
                console.warn('[DB] Disconnected — attempting reconnect...');
                setTimeout(() => connect(), RETRY_DELAY_MS);
            });

            return true;
        } catch (error: any) {
            retryCount++;
            if (retryCount < MAX_RETRIES) {
                console.warn(`[DB] Connection failed (attempt ${retryCount}/${MAX_RETRIES}), retrying in ${RETRY_DELAY_MS / 1000}s...`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                return connect();
            }
            console.error('[DB] Max retries reached — running without MongoDB:', error.message);
            return false;
        }
    };

    return connect();
};

export const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('[DB] Disconnected gracefully');
    } catch (e) {
        console.error('[DB] Error during disconnect:', e);
    }
};

export const isDBConnected = (): boolean =>
    mongoose.connection.readyState === 1;
