// ============================================================
// SecureParcel — Complete TypeScript Type Definitions
// ============================================================

export type Role = 'student' | 'delivery' | 'guard' | 'admin';
export type SubscriptionTier = 'free' | 'premium';
export type ThemeMode = 'light' | 'dark';
export type AIProvider = 'openai' | 'groq' | 'gemini' | 'mock';

// ─── User ───────────────────────────────────────────────────
export interface User {
    uid: string;
    role: Role;
    id: string; // University/delivery/guard ID
    name: string;
    email: string;
    department?: string;
    phone?: string;
    avatarUrl?: string;
    pushToken?: string;
    premiumTier: SubscriptionTier;
    biometricEnabled?: boolean;
    createdAt?: string;
    lastLoginAt?: string;
}

// ─── Package ─────────────────────────────────────────────────
export type PackageStatus = 'pending' | 'stored' | 'verified' | 'collected' | 'expired';

export interface Package {
    id: string;
    studentId: string;
    studentName: string;
    deliveryAgentId?: string;
    courier: string;
    slot: string;
    status: PackageStatus;
    otp: string;
    dynamicQr: string;
    photoUrl?: string;
    estimatedPickupTime?: string;
    guardName?: string;
    guardId?: string;
    createdAt: string;
    collectedAt?: string;
    verifiedAt?: string;
    expiresAt?: string;
}

// ─── Locker ──────────────────────────────────────────────────
export type LockerSize = 'S' | 'M' | 'L' | 'XL';
export type LockerStatus = 'available' | 'reserved' | 'occupied' | 'maintenance';
export type LockerZone = 'A' | 'B' | 'C';

export interface LockerCompartment {
    id: string;
    status: LockerStatus;
    size: LockerSize;
    zone?: LockerZone;
    currentPackageId?: string;
    temperature?: number;
    lastMaintenanceAt?: string;
}

// ─── Notification ─────────────────────────────────────────────
export type NotificationType =
    | 'package_arrived'
    | 'package_collected'
    | 'otp_generated'
    | 'system_alert'
    | 'promo'
    | 'reminder'
    | 'welcome';

export interface AppNotification {
    id: string;
    userId: string;
    title: string;
    body: string;
    type: NotificationType;
    data?: Record<string, any>;
    read: boolean;
    pushSent?: boolean;
    createdAt: string;
}

// ─── AI Chat ─────────────────────────────────────────────────
export interface AIMessage {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    isStreaming?: boolean;
    error?: boolean;
    provider?: AIProvider;
}

export interface AIContext {
    activePackages: Package[];
    lockers: LockerCompartment[];
    userName: string;
    studentId?: string;
}

// ─── Analytics ────────────────────────────────────────────────
export interface DeliveryStats {
    totalDeposits: number;
    todayDeposits: number;
    averageTimeMinutes: number;
    rating: number;
    weeklyTrend: number[]; // 7-day array
}

export interface GuardStats {
    totalVerifications: number;
    todayVerifications: number;
    successRate: number;
    avgVerificationTimeSeconds: number;
    weeklyTrend: number[];
}

export interface StudentStats {
    totalPackages: number;
    collectedPackages: number;
    pendingPackages: number;
    avgPickupHours: number;
    mostUsedCourier: string;
    weeklyTrend: number[];
}

export interface LockerHeatmapData {
    lockerId: string;
    usageCount: number;
    avgOccupancyHours: number;
}

// ─── Navigation ───────────────────────────────────────────────
export type RootStackParamList = {
    Onboarding: undefined;
    Login: undefined;
    Signup: { initialRole: Role };
    ForgotPassword: undefined;
    TermsPrivacy: undefined;
    StudentRoot: undefined;
    DeliveryDashboard: undefined;
    GuardDashboard: undefined;
    AIChatScreen: undefined;
    Settings: undefined;
    LiveTracking: { packageId: string };
    LockerMap: undefined;
    Premium: undefined;
    AnalyticsDashboard: undefined;
    PackagePhoto: { onCapture: (uri: string) => void };
    DeliveryHistory: undefined;
    ActivityLog: undefined;
    GuardAnalytics: undefined;
};

export type StudentTabParamList = {
    Home: undefined;
    History: undefined;
    Notifications: undefined;
    Profile: undefined;
    AI: undefined;
};

// ─── Onboarding ───────────────────────────────────────────────
export interface OnboardingSlide {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    color: string;
}

// ─── Premium Offering ─────────────────────────────────────────
export interface PremiumFeature {
    icon: string;
    title: string;
    subtitle: string;
    availableOn: SubscriptionTier[];
}

// ─── Timeline Step ────────────────────────────────────────────
export interface TimelineStep {
    id: string;
    label: string;
    description: string;
    status: 'completed' | 'active' | 'pending';
    timestamp?: string;
    icon?: string;
}

// ─── API Response ─────────────────────────────────────────────
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code?: string;
    };
    meta?: {
        total?: number;
        page?: number;
        limit?: number;
    };
}
