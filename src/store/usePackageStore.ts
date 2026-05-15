// ============================================================
// Package Store — Enhanced with Firestore real-time sync
// ============================================================

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Package, PackageStatus, LockerCompartment } from '../types';
import {
    subscribeToStudentPackages,
    subscribeToActivePackages,
    createPackage as createPackageInFirestore,
    updatePackageStatus as updatePackageInFirestore,
} from '../services/firestoreService';
import type { Unsubscribe } from 'firebase/firestore';
import { useAuthStore } from './useAuthStore';
import { isFirebaseConfigured } from '../services/firebase';

// Default mock lockers
const DEFAULT_LOCKERS: LockerCompartment[] = [
    { id: 'S1', status: 'available', size: 'S', zone: 'A' },
    { id: 'S2', status: 'available', size: 'S', zone: 'A' },
    { id: 'S3', status: 'available', size: 'S', zone: 'B' },
    { id: 'S4', status: 'available', size: 'S', zone: 'B' },
    { id: 'M1', status: 'available', size: 'M', zone: 'A' },
    { id: 'M2', status: 'available', size: 'M', zone: 'B' },
    { id: 'M3', status: 'available', size: 'M', zone: 'C' },
    { id: 'L1', status: 'available', size: 'L', zone: 'A' },
    { id: 'L2', status: 'available', size: 'L', zone: 'C' },
    { id: 'XL1', status: 'available', size: 'XL', zone: 'C' },
];

interface PackageState {
    packages: Package[];
    lockers: LockerCompartment[];
    isLoading: boolean;
    error: string | null;
    lastFetched: string | null;
    unsubscribeFn: Unsubscribe | null;

    // Getters
    getActivePackages: () => Package[];
    getCollectedPackages: () => Package[];
    getPackageById: (id: string) => Package | undefined;
    getAvailableLockers: (size?: string) => LockerCompartment[];
    getLockerById: (id: string) => LockerCompartment | undefined;

    // Actions
    setPackages: (packages: Package[]) => void;
    setLockers: (lockers: LockerCompartment[]) => void;
    addPackage: (pkg: Package) => void;
    updatePackageStatus: (id: string, status: PackageStatus, guardName?: string, guardId?: string) => void;
    updateLockerStatus: (id: string, status: LockerCompartment['status']) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    resetPackages: () => void;

    // Async actions
    depositPackage: (pkg: Package) => Promise<boolean>;
    verifyAndCollect: (packageId: string, otp: string, guardId: string, guardName: string) => Promise<boolean>;
    subscribeToPackages: (studentId: string) => void;
    subscribeToAllActive: () => void;
    unsubscribe: () => void;
    fetchUserPackages: () => void;
}

export const usePackageStore = create<PackageState>()(
    devtools(
        (set, get) => ({
            packages: [],
            lockers: DEFAULT_LOCKERS,
            isLoading: false,
            error: null,
            lastFetched: null,
            unsubscribeFn: null,

            // ─── Getters ───────────────────────────────────────────
            getActivePackages: () => get().packages.filter(p => p.status === 'stored'),
            getCollectedPackages: () => get().packages.filter(p => p.status === 'collected'),
            getPackageById: (id) => get().packages.find(p => p.id === id),
            getAvailableLockers: (size) => {
                const lockers = get().lockers.filter(l => l.status === 'available');
                return size ? lockers.filter(l => l.size === size) : lockers;
            },
            getLockerById: (id) => get().lockers.find(l => l.id === id),

            // ─── Sync Actions ──────────────────────────────────────
            setPackages: (packages) => set({ packages, lastFetched: new Date().toISOString() }),
            setLockers: (lockers) => set({ lockers }),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),
            resetPackages: () => set({ packages: [], lockers: DEFAULT_LOCKERS }),

            addPackage: (pkg) =>
                set(state => {
                    const updatedLockers = state.lockers.map(l =>
                        l.id === pkg.slot ? { ...l, status: 'occupied' as const, currentPackageId: pkg.id } : l
                    );
                    return {
                        packages: [pkg, ...state.packages],
                        lockers: updatedLockers,
                    };
                }),

            updatePackageStatus: (id, status, guardName, guardId) =>
                set(state => {
                    const pkgToUpdate = state.packages.find(p => p.id === id);
                    const updatedPackages = state.packages.map(p =>
                        p.id === id
                            ? {
                                  ...p,
                                  status,
                                  guardName: guardName || p.guardName,
                                  guardId: guardId || p.guardId,
                                  collectedAt: status === 'collected' ? new Date().toISOString() : p.collectedAt,
                                  verifiedAt: status === 'verified' ? new Date().toISOString() : p.verifiedAt,
                              }
                            : p
                    );

                    let updatedLockers = state.lockers;
                    if (status === 'collected' && pkgToUpdate) {
                        updatedLockers = state.lockers.map(l =>
                            l.id === pkgToUpdate.slot ? { ...l, status: 'available' as const, currentPackageId: undefined } : l
                        );
                    }
                    return { packages: updatedPackages, lockers: updatedLockers };
                }),

            updateLockerStatus: (id, status) =>
                set(state => ({
                    lockers: state.lockers.map(l => (l.id === id ? { ...l, status } : l)),
                })),

            // ─── Async Actions ────────────────────────────────────
            depositPackage: async (pkg) => {
                get().addPackage(pkg);
                const success = await createPackageInFirestore(pkg);
                return success;
            },

            verifyAndCollect: async (packageId, otp, guardId, guardName) => {
                const pkg = get().getPackageById(packageId);
                if (!pkg) return false;

                if (pkg.otp !== otp) return false;

                // Update local state immediately
                get().updatePackageStatus(packageId, 'collected', guardName, guardId);

                // Sync to Firestore
                await updatePackageInFirestore(packageId, 'collected', {
                    guardId,
                    guardName,
                    collectedAt: new Date().toISOString(),
                });

                return true;
            },

            subscribeToPackages: (studentId) => {
                get().unsubscribe();
                
                const mockPackages: Package[] = [
                    {
                        id: 'PKG-DHL-7729',
                        studentId: studentId,
                        studentName: useAuthStore.getState().user?.name || 'Student User',
                        courier: 'DHL Express',
                        slot: 'M2',
                        otp: '8492',
                        status: 'stored',
                        dynamicQr: 'PKG-DHL-7729',
                        createdAt: new Date().toISOString(),
                    },
                    {
                        id: 'PKG-AMZN-4091',
                        studentId: studentId,
                        studentName: useAuthStore.getState().user?.name || 'Student User',
                        courier: 'Amazon Prime',
                        slot: 'S4',
                        otp: '2938',
                        status: 'stored',
                        dynamicQr: 'PKG-AMZN-4091',
                        createdAt: new Date(Date.now() - 3600000).toISOString(),
                    },
                    {
                        id: 'PKG-AMZN-9912',
                        studentId: studentId,
                        studentName: useAuthStore.getState().user?.name || 'Student User',
                        courier: 'Amazon Prime',
                        slot: 'M3',
                        otp: '1829',
                        status: 'stored',
                        dynamicQr: 'PKG-AMZN-9912',
                        createdAt: new Date(Date.now() - 18000000).toISOString(), // 5 hours ago
                    },
                    {
                        id: 'PKG-POST-1930',
                        studentId: studentId,
                        studentName: useAuthStore.getState().user?.name || 'Student User',
                        courier: 'India Post',
                        slot: 'S1',
                        otp: '1930',
                        status: 'stored',
                        dynamicQr: 'PKG-POST-1930',
                        createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
                    },
                    {
                        id: 'PKG-DTDC-8812',
                        studentId: studentId,
                        studentName: useAuthStore.getState().user?.name || 'Student User',
                        courier: 'DTDC Courier',
                        slot: 'L1',
                        otp: '7183',
                        status: 'pending',
                        dynamicQr: 'PKG-DTDC-8812',
                        createdAt: new Date(Date.now() - 7200000).toISOString(),
                    },
                    {
                        id: 'PKG-DHL-1029',
                        studentId: studentId,
                        studentName: useAuthStore.getState().user?.name || 'Student User',
                        courier: 'DHL Priority',
                        slot: 'S2',
                        otp: '4029',
                        status: 'pending',
                        dynamicQr: 'PKG-DHL-1029',
                        createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
                    },
                    {
                        id: 'PKG-BLUE-2831',
                        studentId: studentId,
                        studentName: useAuthStore.getState().user?.name || 'Student User',
                        courier: 'Blue Dart Premium',
                        slot: 'XL2',
                        otp: '2831',
                        status: 'verified',
                        dynamicQr: 'PKG-BLUE-2831',
                        createdAt: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
                        verifiedAt: new Date(Date.now() - 600000).toISOString(), // 10 mins ago
                    },
                    {
                        id: 'PKG-BLUE-4920',
                        studentId: studentId,
                        studentName: useAuthStore.getState().user?.name || 'Student User',
                        courier: 'Blue Dart',
                        slot: 'XL1',
                        otp: '4920',
                        status: 'collected',
                        dynamicQr: 'PKG-BLUE-4920',
                        createdAt: new Date(Date.now() - 86400000).toISOString(),
                        collectedAt: new Date(Date.now() - 82000000).toISOString(),
                    },
                    {
                        id: 'PKG-FEDX-9081',
                        studentId: studentId,
                        studentName: useAuthStore.getState().user?.name || 'Student User',
                        courier: 'FedEx Express',
                        slot: 'L2',
                        otp: '9081',
                        status: 'collected',
                        dynamicQr: 'PKG-FEDX-9081',
                        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                        collectedAt: new Date(Date.now() - 169000000).toISOString(),
                    },
                    {
                        id: 'PKG-UPS-8821',
                        studentId: studentId,
                        studentName: useAuthStore.getState().user?.name || 'Student User',
                        courier: 'UPS Express',
                        slot: 'L2',
                        otp: '8821',
                        status: 'collected',
                        dynamicQr: 'PKG-UPS-8821',
                        createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
                        collectedAt: new Date(Date.now() - 340000000).toISOString(),
                    },
                    {
                        id: 'PKG-FLIP-3012',
                        studentId: studentId,
                        studentName: useAuthStore.getState().user?.name || 'Student User',
                        courier: 'Flipkart Logistics',
                        slot: 'M1',
                        otp: '3012',
                        status: 'expired',
                        dynamicQr: 'PKG-FLIP-3012',
                        createdAt: new Date(Date.now() - 691200000).toISOString(), // 8 days ago
                    },
                    {
                        id: 'PKG-FEDX-3421',
                        studentId: studentId,
                        studentName: useAuthStore.getState().user?.name || 'Student User',
                        courier: 'FedEx Priority',
                        slot: 'XL1',
                        otp: '9120',
                        status: 'expired',
                        dynamicQr: 'PKG-FEDX-3421',
                        createdAt: new Date(Date.now() - 1000000000).toISOString(), // 11.5 days ago
                    }
                ];

                if (!isFirebaseConfigured()) {
                    set({ packages: mockPackages, isLoading: false, lastFetched: new Date().toISOString() });
                    return;
                }

                set({ isLoading: true });
                
                // Safety timeout for unconfigured or slow Firebase connections to avoid infinite loading screens
                const timeoutId = setTimeout(() => {
                    if (get().isLoading) {
                        console.warn('[PackageStore] Firestore subscription timed out. Falling back to mock data.');
                        if (get().packages.length === 0) {
                            set({ packages: mockPackages, isLoading: false, lastFetched: new Date().toISOString() });
                        } else {
                            set({ isLoading: false });
                        }
                    }
                }, 1500);

                const unsub = subscribeToStudentPackages(studentId, (packages, err) => {
                    clearTimeout(timeoutId);
                    if (err) {
                        console.warn('[PackageStore] Firestore subscription error. Falling back/preserving mock data.', err);
                        if (get().packages.length === 0) {
                            set({ packages: mockPackages, isLoading: false, lastFetched: new Date().toISOString() });
                        } else {
                            set({ isLoading: false });
                        }
                        return;
                    }
                    set({ packages, isLoading: false, lastFetched: new Date().toISOString() });
                });
                
                set({ 
                    unsubscribeFn: () => {
                        clearTimeout(timeoutId);
                        unsub();
                    } 
                });
            },

            subscribeToAllActive: () => {
                get().unsubscribe();
                
                if (!isFirebaseConfigured()) {
                    set({ isLoading: false });
                    return;
                }

                set({ isLoading: true });

                const timeoutId = setTimeout(() => {
                    if (get().isLoading) {
                        console.warn('[PackageStore] subscribeToAllActive timed out. Falling back.');
                        set({ isLoading: false });
                    }
                }, 1500);

                const unsub = subscribeToActivePackages((packages, err) => {
                    clearTimeout(timeoutId);
                    if (err) {
                        console.warn('[PackageStore] subscribeToAllActive failed:', err);
                        set({ isLoading: false });
                        return;
                    }
                    set(state => ({
                        packages: mergePackages(state.packages, packages),
                        isLoading: false,
                        lastFetched: new Date().toISOString(),
                    }));
                });

                set({ 
                    unsubscribeFn: () => {
                        clearTimeout(timeoutId);
                        unsub();
                    } 
                });
            },

            unsubscribe: () => {
                const { unsubscribeFn } = get();
                if (unsubscribeFn) {
                    unsubscribeFn();
                    set({ unsubscribeFn: null });
                }
            },

            fetchUserPackages: () => {
                const authUser = useAuthStore.getState().user;
                const userId = authUser?.uid || authUser?.id;
                if (userId) {
                    get().subscribeToPackages(userId);
                }
            },
        }),
        { name: 'PackageStore' }
    )
);

function mergePackages(existing: Package[], incoming: Package[]): Package[] {
    const map = new Map(existing.map(p => [p.id, p]));
    incoming.forEach(p => map.set(p.id, p));
    return Array.from(map.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}
