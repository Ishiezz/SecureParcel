// ============================================================
// Firestore Service — Real-time listeners + CRUD operations
// ============================================================

import {
    collection, doc, getDoc, getDocs, setDoc, updateDoc,
    query, where, orderBy, limit, onSnapshot, Unsubscribe,
    serverTimestamp, Timestamp, writeBatch, deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { Package, AppNotification, LockerCompartment, User } from '../types';

// ─── USER ────────────────────────────────────────────────────
export const getUserDoc = async (uid: string): Promise<User | null> => {
    try {
        const snap = await getDoc(doc(db, 'users', uid));
        return snap.exists() ? (snap.data() as User) : null;
    } catch {
        return null;
    }
};

export const upsertUserDoc = async (uid: string, data: Partial<User>) => {
    try {
        await setDoc(doc(db, 'users', uid), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (e) {
        console.warn('[Firestore] upsertUserDoc failed:', e);
    }
};

// ─── PACKAGES ────────────────────────────────────────────────
export const getPackagesForStudent = async (studentId: string): Promise<Package[]> => {
    try {
        const q = query(
            collection(db, 'packages'),
            where('studentId', '==', studentId),
            orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ ...d.data() } as Package));
    } catch {
        return [];
    }
};

export const getAllActivePackages = async (): Promise<Package[]> => {
    try {
        const q = query(
            collection(db, 'packages'),
            where('status', '==', 'stored'),
            orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ ...d.data() } as Package));
    } catch {
        return [];
    }
};

export const createPackage = async (pkg: Package): Promise<boolean> => {
    try {
        await setDoc(doc(db, 'packages', pkg.id), pkg);
        return true;
    } catch {
        return false;
    }
};

export const updatePackageStatus = async (
    packageId: string,
    status: Package['status'],
    extra?: Partial<Package>
): Promise<boolean> => {
    try {
        await updateDoc(doc(db, 'packages', packageId), {
            status,
            ...extra,
            updatedAt: new Date().toISOString(),
        });
        return true;
    } catch {
        return false;
    }
};

export const subscribeToStudentPackages = (
    studentId: string,
    callback: (packages: Package[], error?: any) => void
): Unsubscribe => {
    try {
        const q = query(
            collection(db, 'packages'),
            where('studentId', '==', studentId),
            orderBy('createdAt', 'desc')
        );
        return onSnapshot(q, snap => {
            callback(snap.docs.map(d => d.data() as Package));
        }, (error) => {
            console.error('[Firestore] subscribeToStudentPackages error:', error);
            callback([], error);
        });
    } catch (e) {
        console.error('[Firestore] subscribeToStudentPackages catch:', e);
        callback([], e);
        return () => {};
    }
};

export const subscribeToActivePackages = (
    callback: (packages: Package[], error?: any) => void
): Unsubscribe => {
    try {
        const q = query(
            collection(db, 'packages'),
            where('status', '==', 'stored'),
            orderBy('createdAt', 'desc')
        );
        return onSnapshot(q, snap => {
            callback(snap.docs.map(d => d.data() as Package));
        }, (error) => {
            console.error('[Firestore] subscribeToActivePackages error:', error);
            callback([], error);
        });
    } catch (e) {
        console.error('[Firestore] subscribeToActivePackages catch:', e);
        callback([], e);
        return () => {};
    }
};

// ─── LOCKERS ─────────────────────────────────────────────────
export const getAllLockers = async (): Promise<LockerCompartment[]> => {
    try {
        const snap = await getDocs(collection(db, 'lockers'));
        return snap.docs.map(d => d.data() as LockerCompartment);
    } catch {
        return [];
    }
};

export const subscribeToLockers = (
    callback: (lockers: LockerCompartment[], error?: any) => void
): Unsubscribe => {
    try {
        return onSnapshot(collection(db, 'lockers'), snap => {
            callback(snap.docs.map(d => d.data() as LockerCompartment));
        }, (error) => {
            console.error('[Firestore] subscribeToLockers error:', error);
            callback([], error);
        });
    } catch (e) {
        console.error('[Firestore] subscribeToLockers catch:', e);
        callback([], e);
        return () => {};
    }
};

export const updateLockerStatus = async (
    lockerId: string,
    status: LockerCompartment['status'],
    currentPackageId?: string
) => {
    try {
        await updateDoc(doc(db, 'lockers', lockerId), {
            status,
            currentPackageId: currentPackageId || null,
            updatedAt: new Date().toISOString(),
        });
    } catch {}
};

// ─── NOTIFICATIONS ───────────────────────────────────────────
export const getNotificationsForUser = async (userId: string): Promise<AppNotification[]> => {
    try {
        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(50)
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => d.data() as AppNotification);
    } catch {
        return [];
    }
};

export const subscribeToNotifications = (
    userId: string,
    callback: (notifications: AppNotification[], error?: any) => void
): Unsubscribe => {
    try {
        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(50)
        );
        return onSnapshot(q, snap => {
            callback(snap.docs.map(d => d.data() as AppNotification));
        }, (error) => {
            console.error('[Firestore] subscribeToNotifications error:', error);
            callback([], error);
        });
    } catch (e) {
        console.error('[Firestore] subscribeToNotifications catch:', e);
        callback([], e);
        return () => {};
    }
};

export const markNotificationRead = async (notificationId: string) => {
    try {
        await updateDoc(doc(db, 'notifications', notificationId), { read: true });
    } catch {}
};

export const createNotification = async (notification: Omit<AppNotification, 'read'>) => {
    try {
        await setDoc(doc(db, 'notifications', notification.id), {
            ...notification,
            read: false,
        });
    } catch {}
};
