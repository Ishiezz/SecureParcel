// ============================================================
// RevenueCat Service — In-app subscriptions with mock fallback
// ============================================================

import { SubscriptionTier } from '../types';

let purchasesEnabled = false;
let PurchasesModule: any = null;

const MOCK_OFFERINGS = {
    premium_monthly: {
        product: {
            title: 'SecureParcel Premium Monthly',
            description: 'Priority lockers, 90-day history, unlimited AI chat, analytics',
            priceString: '₹99/month',
        },
        identifier: 'premium_monthly',
    },
    premium_yearly: {
        product: {
            title: 'SecureParcel Premium Yearly',
            description: 'All Premium features — Save 50%!',
            priceString: '₹599/year',
        },
        identifier: 'premium_yearly',
    },
};

export const initRevenueCat = async (userId?: string) => {
    try {
        const Platform = (await import('react-native')).Platform;
        const apiKey = Platform.OS === 'ios'
            ? (process.env.EXPO_PUBLIC_RC_APPLE_KEY || process.env.EXPO_PUBLIC_REVENUECAT_API_KEY)
            : (process.env.EXPO_PUBLIC_RC_GOOGLE_KEY || process.env.EXPO_PUBLIC_REVENUECAT_API_KEY);

        if (!apiKey || apiKey === 'YOUR_REVENUECAT_API_KEY' || apiKey.startsWith('your_')) {
            console.log('[RevenueCat] Not configured — using mock fallback');
            return;
        }

        PurchasesModule = await import('react-native-purchases');
        await PurchasesModule.default.configure({ apiKey });
        if (userId) await PurchasesModule.default.logIn(userId);
        purchasesEnabled = true;
        console.log('[RevenueCat] Initialized');
    } catch {
        console.log('[RevenueCat] Package not available — using mock fallback');
    }
};

export const getOfferings = async (): Promise<any> => {
    if (purchasesEnabled && PurchasesModule) {
        try {
            const offerings = await PurchasesModule.default.getOfferings();
            return offerings.current?.availablePackages || [];
        } catch {}
    }
    return Object.values(MOCK_OFFERINGS);
};

export const checkPremiumStatus = async (): Promise<SubscriptionTier> => {
    if (purchasesEnabled && PurchasesModule) {
        try {
            const customerInfo = await PurchasesModule.default.getCustomerInfo();
            const hasActive = Object.keys(customerInfo.entitlements.active).length > 0;
            return hasActive ? 'premium' : 'free';
        } catch {}
    }
    return 'free';
};

export const purchasePackage = async (packageIdentifier: string): Promise<boolean> => {
    if (purchasesEnabled && PurchasesModule) {
        try {
            const offerings = await PurchasesModule.default.getOfferings();
            const pkg = offerings.current?.availablePackages?.find(
                (p: any) => p.identifier === packageIdentifier
            );
            if (pkg) {
                await PurchasesModule.default.purchasePackage(pkg);
                return true;
            }
        } catch (e: any) {
            if (e.userCancelled) return false;
            throw e;
        }
    }
    // Mock purchase — always succeeds in dev
    console.log(`[RevenueCat Mock] Purchased: ${packageIdentifier}`);
    return true;
};

export const restorePurchases = async (): Promise<SubscriptionTier> => {
    if (purchasesEnabled && PurchasesModule) {
        try {
            const customerInfo = await PurchasesModule.default.restorePurchases();
            const hasActive = Object.keys(customerInfo.entitlements.active).length > 0;
            return hasActive ? 'premium' : 'free';
        } catch {}
    }
    return 'free';
};

export const logOutRevenueCat = async () => {
    if (purchasesEnabled && PurchasesModule) {
        try {
            await PurchasesModule.default.logOut();
        } catch {}
    }
};
