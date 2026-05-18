import { sendFCMNotification } from '../config/firebaseAdmin';
import { User } from '../models/User';

export const sendPushToUser = async (userId: string, title: string, body: string, data?: Record<string, string>): Promise<boolean> => {
    try {
        const user = await User.findOne({ id: userId });
        if (!user || !user.pushToken) return false;

        return await sendFCMNotification(user.pushToken, title, body, data);
    } catch (e) {
        console.warn(`[Push] Failed to send to user ${userId}:`, e);
        return false;
    }
};

export const sendPushToRole = async (role: string, title: string, body: string, data?: Record<string, string>): Promise<void> => {
    try {
        const users = await User.find({ role, pushToken: { $exists: true, $ne: null } });
        const tokens = users.map(u => u.pushToken!).filter(Boolean);

        // In a real app, use sendMulticast for batching.
        // For simplicity here, loop through them.
        const promises = tokens.map(token => sendFCMNotification(token, title, body, data));
        await Promise.allSettled(promises);
    } catch (e) {
        console.warn(`[Push] Failed to broadcast to role ${role}:`, e);
    }
};
