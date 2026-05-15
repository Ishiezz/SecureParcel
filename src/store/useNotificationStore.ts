// ============================================================
// Notification Store — Real-time Firestore-backed notifications
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppNotification, NotificationType } from '../types';
import {
    subscribeToNotifications,
    markNotificationRead,
    getNotificationsForUser,
    createNotification,
} from '../services/firestoreService';
import type { Unsubscribe } from 'firebase/firestore';
import { useAuthStore } from './useAuthStore';
import { usePackageStore } from './usePackageStore';
import { isFirebaseConfigured } from '../services/firebase';

interface NotificationState {
    notifications: AppNotification[];
    unreadCount: number;
    isLoading: boolean;
    unsubscribeFn: Unsubscribe | null;

    // Actions
    setNotifications: (notifications: AppNotification[]) => void;
    addNotification: (notification: AppNotification) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;

    // Async actions
    subscribeToUserNotifications: (userId: string) => void;
    fetchNotifications: (userId?: string) => Promise<void>;
    markReadInFirestore: (id: string) => Promise<void>;
    pushNotification: (notification: Omit<AppNotification, 'read'>) => Promise<void>;
    unsubscribe: () => void;
}

// Generate mock notifications for demo/fallback
export const generateMockNotifications = (userName: string, packages: any[]): AppNotification[] => {
    const notifs: AppNotification[] = [];

    packages.forEach((pkg: any) => {
        notifs.push({
            id: `arrived-${pkg.id}`,
            userId: pkg.studentId,
            title: '📦 Parcel Arrived!',
            body: `Your ${pkg.courier} package is secured in Slot ${pkg.slot}. Ready for pickup!`,
            type: 'package_arrived',
            data: { packageId: pkg.id, slot: pkg.slot },
            read: pkg.status === 'collected',
            createdAt: pkg.createdAt,
        });

        if (pkg.status === 'collected' && pkg.collectedAt) {
            notifs.push({
                id: `collected-${pkg.id}`,
                userId: pkg.studentId,
                title: '✅ Package Collected',
                body: `Your ${pkg.courier} parcel was successfully handed over. Slot ${pkg.slot} is now free.`,
                type: 'package_collected',
                data: { packageId: pkg.id },
                read: true,
                createdAt: pkg.collectedAt,
            });
        }
    });

    // Welcome notification
    const welcomeDate = new Date();
    welcomeDate.setDate(welcomeDate.getDate() - 3);
    notifs.push({
        id: 'welcome-001',
        userId: 'system',
        title: `Welcome to SecureParcel! 🎉`,
        body: `Hi ${userName.split(' ')[0]}! Your account is active. You'll be notified instantly when packages arrive.`,
        type: 'welcome',
        read: true,
        createdAt: welcomeDate.toISOString(),
    });

    return notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const useNotificationStore = create<NotificationState>()(
    devtools(
        persist(
            (set, get) => ({
                notifications: [],
                unreadCount: 0,
                isLoading: false,
                unsubscribeFn: null,

                setNotifications: (notifications) =>
                    set({
                        notifications,
                        unreadCount: notifications.filter(n => !n.read).length,
                    }),

                addNotification: (notification) =>
                    set(state => {
                        const updated = [notification, ...state.notifications];
                        return {
                            notifications: updated,
                            unreadCount: updated.filter(n => !n.read).length,
                        };
                    }),

                markAsRead: (id) =>
                    set(state => {
                        const updated = state.notifications.map(n =>
                            n.id === id ? { ...n, read: true } : n
                        );
                        return {
                            notifications: updated,
                            unreadCount: updated.filter(n => !n.read).length,
                        };
                    }),

                markAllAsRead: () =>
                    set(state => ({
                        notifications: state.notifications.map(n => ({ ...n, read: true })),
                        unreadCount: 0,
                    })),

                clearNotifications: () => set({ notifications: [], unreadCount: 0 }),

                subscribeToUserNotifications: (userId) => {
                    get().unsubscribe();
                    
                    const mockPackages = usePackageStore.getState().packages;
                    const authUser = useAuthStore.getState().user;
                    const mockNotifs = generateMockNotifications(authUser?.name || 'Student User', mockPackages);

                    if (!isFirebaseConfigured()) {
                        set({ notifications: mockNotifs, unreadCount: mockNotifs.filter(n => !n.read).length, isLoading: false });
                        return;
                    }

                    set({ isLoading: true });

                    const timeoutId = setTimeout(() => {
                        if (get().isLoading) {
                            console.warn('[NotificationStore] Subscription timed out. Falling back to mock notifications.');
                            if (get().notifications.length === 0) {
                                set({ notifications: mockNotifs, unreadCount: mockNotifs.filter(n => !n.read).length, isLoading: false });
                            } else {
                                set({ isLoading: false });
                            }
                        }
                    }, 1500);

                    const unsub = subscribeToNotifications(userId, (notifications, err) => {
                        clearTimeout(timeoutId);
                        if (err) {
                            console.warn('[NotificationStore] Subscription error, keeping/falling back to mock:', err);
                            if (get().notifications.length === 0) {
                                set({ notifications: mockNotifs, unreadCount: mockNotifs.filter(n => !n.read).length, isLoading: false });
                            } else {
                                set({ isLoading: false });
                            }
                            return;
                        }
                        set({
                            notifications,
                            unreadCount: notifications.filter(n => !n.read).length,
                            isLoading: false,
                        });
                    });
                    
                    set({ 
                        unsubscribeFn: () => {
                            clearTimeout(timeoutId);
                            unsub();
                        }
                    });
                },

                fetchNotifications: async (userId) => {
                    const id = userId || useAuthStore.getState().user?.uid || useAuthStore.getState().user?.id;
                    if (!id) {
                        set({ isLoading: false });
                        return;
                    }

                    if (!isFirebaseConfigured()) {
                        const mockPackages = usePackageStore.getState().packages;
                        const authUser = useAuthStore.getState().user;
                        const finalNotifications = generateMockNotifications(authUser?.name || 'Student User', mockPackages);
                        set({
                            notifications: finalNotifications,
                            unreadCount: finalNotifications.filter(n => !n.read).length,
                            isLoading: false,
                        });
                        return;
                    }

                    set({ isLoading: true });
                    try {
                        const notifications = await getNotificationsForUser(id);
                        
                        // Fallback: Generate mock notifications if Firestore is empty or unconfigured
                        let finalNotifications = notifications;
                        if (notifications.length === 0) {
                            const mockPackages = usePackageStore.getState().packages;
                            const authUser = useAuthStore.getState().user;
                            finalNotifications = generateMockNotifications(authUser?.name || 'Student User', mockPackages);
                        }
                        
                        set({
                            notifications: finalNotifications,
                            unreadCount: finalNotifications.filter(n => !n.read).length,
                            isLoading: false,
                        });
                    } catch (error) {
                        console.error('[NotificationStore] fetchNotifications failed:', error);
                        set({ isLoading: false });
                    }
                },

                markReadInFirestore: async (id) => {
                    get().markAsRead(id);
                    await markNotificationRead(id);
                },

                pushNotification: async (notification) => {
                    const full: AppNotification = { ...notification, read: false };
                    get().addNotification(full);
                    await createNotification(notification);
                },

                unsubscribe: () => {
                    const { unsubscribeFn } = get();
                    if (unsubscribeFn) {
                        unsubscribeFn();
                        set({ unsubscribeFn: null });
                    }
                },
            }),
            {
                name: 'notification-storage',
                storage: createJSONStorage(() => AsyncStorage),
                partialize: (state) => ({
                    notifications: state.notifications.slice(0, 50), // Keep last 50
                    unreadCount: state.unreadCount,
                }),
            }
        ),
        { name: 'NotificationStore' }
    )
);
