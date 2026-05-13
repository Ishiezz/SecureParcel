// ============================================================
// Push Notification Service — Expo Notifications with fallback
// ============================================================

import { Platform } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

let notificationsModule: any = null;
let notificationsEnabled = false;
let notificationListeners: any[] = [];

export const initPushNotifications = async (userId: string) => {
    try {
        notificationsModule = await import('expo-notifications');

        // Configure how notifications appear
        await notificationsModule.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
            }),
        });

        const token = await registerForPushNotifications();
        if (token && userId) {
            await savePushToken(userId, token);
        }
        notificationsEnabled = true;
    } catch {
        console.log('[Notifications] expo-notifications not available');
    }
};

export const registerForPushNotifications = async (): Promise<string | null> => {
    if (!notificationsModule) return null;

    try {
        if (Platform.OS === 'android') {
            await notificationsModule.setNotificationChannelAsync('default', {
                name: 'SecureParcel',
                importance: notificationsModule.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FFFFFF',
            });
        }

        const { status: existingStatus } = await notificationsModule.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await notificationsModule.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('[Notifications] Permission not granted');
            return null;
        }

        const { data: token } = await notificationsModule.getExpoPushTokenAsync();
        return token;
    } catch (err) {
        console.warn('[Notifications] Could not get push token:', err);
        return null;
    }
};

export const savePushToken = async (userId: string, token: string) => {
    try {
        await updateDoc(doc(db, 'users', userId), { pushToken: token });
    } catch {
        // Silently fail — token saving is non-critical
    }
};

export const scheduleLocalNotification = async (
    title: string,
    body: string,
    seconds: number = 1
) => {
    if (!notificationsModule) {
        console.log(`[Notification Mock] ${title}: ${body}`);
        return;
    }
    try {
        await notificationsModule.scheduleNotificationAsync({
            content: { title, body, sound: 'default' },
            trigger: { seconds },
        });
    } catch {}
};

export const showImmediateNotification = async (title: string, body: string) => {
    await scheduleLocalNotification(title, body, 1);
};

export const addNotificationListener = (
    onReceived: (notification: any) => void,
    onResponse: (response: any) => void
) => {
    if (!notificationsModule) return;
    try {
        const sub1 = notificationsModule.addNotificationReceivedListener(onReceived);
        const sub2 = notificationsModule.addNotificationResponseReceivedListener(onResponse);
        notificationListeners.push(sub1, sub2);
    } catch {}
};

export const removeAllListeners = () => {
    notificationListeners.forEach(sub => {
        try { sub.remove(); } catch {}
    });
    notificationListeners = [];
};

export const setBadgeCount = async (count: number) => {
    if (!notificationsModule) return;
    try {
        await notificationsModule.setBadgeCountAsync(count);
    } catch {}
};

export const requestPushPermissions = registerForPushNotifications;
