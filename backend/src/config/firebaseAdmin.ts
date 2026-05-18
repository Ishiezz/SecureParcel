import admin from 'firebase-admin';

let initialized = false;

export const initFirebaseAdmin = () => {
    if (initialized) return;

    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

    if (serviceAccountJson) {
        try {
            const serviceAccount = JSON.parse(serviceAccountJson);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            });
            initialized = true;
            console.log('[Firebase Admin] Initialized with service account');
        } catch (e) {
            console.warn('[Firebase Admin] Invalid service account JSON:', e);
            initWithApplicationDefault();
        }
    } else {
        initWithApplicationDefault();
    }
};

const initWithApplicationDefault = () => {
    try {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
        });
        initialized = true;
        console.log('[Firebase Admin] Initialized with application default credentials');
    } catch {
        console.warn('[Firebase Admin] Not configured — Firebase Admin features disabled');
    }
};

export const getAdminAuth = () => {
    if (!initialized) return null;
    return admin.auth();
};

export const getAdminFirestore = () => {
    if (!initialized) return null;
    return admin.firestore();
};

export const verifyFirebaseToken = async (token: string): Promise<admin.auth.DecodedIdToken | null> => {
    const adminAuth = getAdminAuth();
    if (!adminAuth) return null;
    try {
        return await adminAuth.verifyIdToken(token);
    } catch {
        return null;
    }
};

export const sendFCMNotification = async (
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>
): Promise<boolean> => {
    if (!initialized) return false;
    try {
        await admin.messaging().send({
            token,
            notification: { title, body },
            data,
            apns: { payload: { aps: { sound: 'default', badge: 1 } } },
            android: { notification: { sound: 'default', channelId: 'default' } },
        });
        return true;
    } catch (e: any) {
        console.warn('[FCM] Send failed:', e.message);
        return false;
    }
};

export { admin };
