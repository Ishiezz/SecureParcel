// ============================================================
// Locker Store — Real-time Firestore sync for locker statuses
// ============================================================

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { LockerCompartment, LockerSize } from '../types';
import {
    subscribeToLockers,
    getAllLockers,
    updateLockerStatus,
} from '../services/firestoreService';
import type { Unsubscribe } from 'firebase/firestore';
import { isFirebaseConfigured } from '../services/firebase';

interface LockerState {
    lockers: LockerCompartment[];
    isLoading: boolean;
    unsubscribeFn: Unsubscribe | null;

    // Actions
    setLockers: (lockers: LockerCompartment[]) => void;
    setLoading: (loading: boolean) => void;
    
    // Selectors
    getAvailableLockers: (size?: LockerSize) => LockerCompartment[];
    getLockerById: (id: string) => LockerCompartment | undefined;
    getOccupancyRate: () => number;

    // Async actions
    fetchLockers: () => Promise<void>;
    subscribeToLockerUpdates: () => void;
    reserveLocker: (id: string) => Promise<boolean>;
    releaseLocker: (id: string) => Promise<boolean>;
    unsubscribe: () => void;
}

// Fallback/Demo Lockers
const DEMO_LOCKERS: LockerCompartment[] = [
    { id: 'A-01', status: 'available', size: 'S', zone: 'A' },
    { id: 'A-02', status: 'available', size: 'S', zone: 'A' },
    { id: 'A-03', status: 'available', size: 'M', zone: 'A' },
    { id: 'B-01', status: 'available', size: 'S', zone: 'B' },
    { id: 'B-02', status: 'available', size: 'M', zone: 'B' },
    { id: 'C-01', status: 'available', size: 'L', zone: 'C' },
    { id: 'C-02', status: 'available', size: 'XL', zone: 'C' },
];

export const useLockerStore = create<LockerState>()(
    devtools(
        (set, get) => ({
            lockers: DEMO_LOCKERS,
            isLoading: false,
            unsubscribeFn: null,

            setLockers: (lockers) => set({ lockers: lockers.length > 0 ? lockers : DEMO_LOCKERS }),
            setLoading: (isLoading) => set({ isLoading }),

            getAvailableLockers: (size) => {
                const available = get().lockers.filter(l => l.status === 'available');
                return size ? available.filter(l => l.size === size) : available;
            },
            
            getLockerById: (id) => get().lockers.find(l => l.id === id),
            
            getOccupancyRate: () => {
                const total = get().lockers.length;
                if (total === 0) return 0;
                const occupied = get().lockers.filter(l => l.status === 'occupied').length;
                return Math.round((occupied / total) * 100);
            },

            fetchLockers: async () => {
                set({ isLoading: true });
                const lockers = await getAllLockers();
                get().setLockers(lockers);
                set({ isLoading: false });
            },

            subscribeToLockerUpdates: () => {
                get().unsubscribe();
                
                if (!isFirebaseConfigured()) {
                    set({ lockers: DEMO_LOCKERS, isLoading: false });
                    return;
                }

                set({ isLoading: true });

                const timeoutId = setTimeout(() => {
                    if (get().isLoading) {
                        console.warn('[LockerStore] subscribeToLockerUpdates timed out. Falling back to local mock lockers.');
                        set({ lockers: DEMO_LOCKERS, isLoading: false });
                    }
                }, 1500);

                const unsub = subscribeToLockers((lockers, err) => {
                    clearTimeout(timeoutId);
                    if (err) {
                        console.warn('[LockerStore] subscribeToLockerUpdates failed, keeping/falling back to mock:', err);
                        if (get().lockers.length === 0) {
                            get().setLockers(DEMO_LOCKERS);
                        }
                        set({ isLoading: false });
                        return;
                    }
                    get().setLockers(lockers);
                    set({ isLoading: false });
                });

                set({ 
                    unsubscribeFn: () => {
                        clearTimeout(timeoutId);
                        unsub();
                    } 
                });
            },

            reserveLocker: async (id) => {
                const locker = get().getLockerById(id);
                if (!locker || locker.status !== 'available') return false;

                // Optimistic UI update
                set(state => ({
                    lockers: state.lockers.map(l => l.id === id ? { ...l, status: 'reserved' as const } : l)
                }));

                try {
                    await updateLockerStatus(id, 'reserved');
                    return true;
                } catch {
                    // Revert on failure
                    set(state => ({
                        lockers: state.lockers.map(l => l.id === id ? { ...l, status: 'available' as const } : l)
                    }));
                    return false;
                }
            },

            releaseLocker: async (id) => {
                set(state => ({
                    lockers: state.lockers.map(l => l.id === id ? { ...l, status: 'available' as const, currentPackageId: undefined } : l)
                }));
                try {
                    await updateLockerStatus(id, 'available');
                    return true;
                } catch {
                    return false; // Sync will correct it eventually
                }
            },

            unsubscribe: () => {
                const { unsubscribeFn } = get();
                if (unsubscribeFn) {
                    unsubscribeFn();
                    set({ unsubscribeFn: null });
                }
            },
        }),
        { name: 'LockerStore' }
    )
);
