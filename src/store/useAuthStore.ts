// ============================================================
// Auth Store — Enhanced with real Firebase auth actions
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile as updateFirebaseProfile,
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { upsertUserDoc, getUserDoc } from '../services/firestoreService';
import { User, Role, SubscriptionTier } from '../types';
import * as LocalAuthentication from 'expo-local-authentication';

interface AuthState {
    user: User | null;
    token: string | null;
    biometricEnabled: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    setUser: (user: User | null) => void;
    setBiometricEnabled: (enabled: boolean) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
    logout: () => Promise<void>;
    updatePremiumTier: (tier: SubscriptionTier) => void;
    updateProfile: (data: Partial<User>) => void;

    // Async actions
    loginWithEmail: (email: string, password: string, role: Role) => Promise<void>;
    signupWithEmail: (data: SignupData) => Promise<void>;
    loginWithBiometric: () => Promise<boolean>;
    resetPassword: (email: string) => Promise<void>;
}

interface SignupData {
    name: string;
    email: string;
    password: string;
    role: Role;
    id: string;
    department?: string;
    phone?: string;
}

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set, get) => ({
                user: null,
                token: null,
                biometricEnabled: true,
                isLoading: false,
                error: null,

                setUser: (user) => set({ user }),
                setBiometricEnabled: (enabled) => set({ biometricEnabled: enabled }),
                setLoading: (isLoading) => set({ isLoading }),
                setError: (error) => set({ error }),
                clearError: () => set({ error: null }),
                updatePremiumTier: (premiumTier) =>
                    set(state => ({ user: state.user ? { ...state.user, premiumTier } : null })),
                updateProfile: (data) =>
                    set(state => ({ user: state.user ? { ...state.user, ...data } : null })),

                loginWithEmail: async (email, password, role) => {
                    set({ isLoading: true, error: null });
                    try {
                        const credential = await signInWithEmailAndPassword(auth, email, password);
                        const firestoreUser = await getUserDoc(credential.user.uid);

                        const user: User = firestoreUser || {
                            uid: credential.user.uid,
                            role,
                            id: email.split('@')[0].toUpperCase(),
                            name: credential.user.displayName || email.split('@')[0],
                            email,
                            premiumTier: 'free',
                        };

                        const token = await credential.user.getIdToken();
                        set({ user, token, isLoading: false });

                        // Update last login
                        await upsertUserDoc(credential.user.uid, { lastLoginAt: new Date().toISOString() });
                    } catch (error: any) {
                        // Dev fallback — mock login
                        if (__DEV__) {
                            const mockUser: User = {
                                uid: `mock-${Date.now()}`,
                                role,
                                id: email.split('@')[0].toUpperCase(),
                                name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
                                email,
                                premiumTier: 'free',
                            };
                            set({ user: mockUser, token: 'mock-token', isLoading: false });
                        } else {
                            set({ error: getAuthErrorMessage(error.code), isLoading: false });
                        }
                    }
                },

                signupWithEmail: async (data) => {
                    set({ isLoading: true, error: null });
                    try {
                        const credential = await createUserWithEmailAndPassword(auth, data.email, data.password);
                        await updateFirebaseProfile(credential.user, { displayName: data.name });

                        const user: User = {
                            uid: credential.user.uid,
                            role: data.role,
                            id: data.id,
                            name: data.name,
                            email: data.email,
                            department: data.department,
                            phone: data.phone,
                            premiumTier: 'free',
                            createdAt: new Date().toISOString(),
                        };

                        await upsertUserDoc(credential.user.uid, user);
                        const token = await credential.user.getIdToken();
                        set({ user, token, isLoading: false });
                    } catch (error: any) {
                        if (__DEV__) {
                            const mockUser: User = {
                                uid: `mock-${Date.now()}`,
                                role: data.role,
                                id: data.id,
                                name: data.name,
                                email: data.email,
                                department: data.department,
                                phone: data.phone,
                                premiumTier: 'free',
                                createdAt: new Date().toISOString(),
                            };
                            set({ user: mockUser, token: 'mock-token', isLoading: false });
                        } else {
                            set({ error: getAuthErrorMessage(error.code), isLoading: false });
                        }
                    }
                },

                loginWithBiometric: async () => {
                    const { user, biometricEnabled } = get();
                    if (!biometricEnabled) return false;

                    try {
                        const compatible = await LocalAuthentication.hasHardwareAsync();
                        const enrolled = await LocalAuthentication.isEnrolledAsync();

                        if (!compatible || (!enrolled && !__DEV__)) return false;

                        const result = await LocalAuthentication.authenticateAsync({
                            promptMessage: 'Authenticate to access SecureParcel',
                            fallbackLabel: 'Use Passcode',
                            disableDeviceFallback: false,
                        });

                        if (result.success && !user) {
                            // Re-login with stored credentials would happen here
                            // For now, if user exists in store, biometric just re-validates
                        }
                        return result.success;
                    } catch {
                        return __DEV__; // In dev, always succeed
                    }
                },

                resetPassword: async (email) => {
                    set({ isLoading: true, error: null });
                    try {
                        await sendPasswordResetEmail(auth, email);
                        set({ isLoading: false });
                    } catch (error: any) {
                        set({ error: getAuthErrorMessage(error.code), isLoading: false });
                    }
                },

                logout: async () => {
                    try {
                        await signOut(auth);
                    } catch {}
                    set({ user: null, token: null, error: null });
                },
            }),
            {
                name: 'auth-storage',
                storage: createJSONStorage(() => AsyncStorage),
                partialize: (state) => ({
                    user: state.user,
                    token: state.token,
                    biometricEnabled: state.biometricEnabled,
                }),
            }
        ),
        { name: 'AuthStore' }
    )
);

function getAuthErrorMessage(code: string): string {
    switch (code) {
        case 'auth/user-not-found': return 'No account found with this email.';
        case 'auth/wrong-password': return 'Incorrect password. Please try again.';
        case 'auth/email-already-in-use': return 'An account with this email already exists.';
        case 'auth/invalid-email': return 'Please enter a valid email address.';
        case 'auth/weak-password': return 'Password should be at least 6 characters.';
        case 'auth/too-many-requests': return 'Too many attempts. Please wait a moment.';
        case 'auth/network-request-failed': return 'Network error. Check your connection.';
        default: return 'Authentication failed. Please try again.';
    }
}
