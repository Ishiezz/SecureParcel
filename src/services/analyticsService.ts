// ============================================================
// Analytics Service — Mixpanel with console.log fallback
// ============================================================

type EventProperties = Record<string, any>;

let mixpanelInstance: any = null;
let analyticsEnabled = false;

export const initAnalytics = async () => {
    const token = process.env.EXPO_PUBLIC_MIXPANEL_TOKEN;
    if (!token || token === 'YOUR_MIXPANEL_TOKEN' || token.startsWith('your_')) {
        console.log('[Analytics] Mixpanel not configured — using console fallback');
        return;
    }
    try {
        const { Mixpanel } = await import('mixpanel-react-native');
        mixpanelInstance = new Mixpanel(token, true);
        await mixpanelInstance.init();
        analyticsEnabled = true;
        console.log('[Analytics] Mixpanel initialized');
    } catch {
        console.log('[Analytics] Mixpanel unavailable — using console fallback');
    }
};

export const trackEvent = (name: string, properties?: EventProperties) => {
    if (analyticsEnabled && mixpanelInstance) {
        mixpanelInstance.track(name, properties);
    } else {
        console.log(`[Analytics Event] ${name}`, properties || {});
    }
};

export const identifyUser = (userId: string, traits?: EventProperties) => {
    if (analyticsEnabled && mixpanelInstance) {
        mixpanelInstance.identify(userId);
        if (traits) mixpanelInstance.getPeople().set(traits);
    } else {
        console.log(`[Analytics] User identified: ${userId}`, traits || {});
    }
};

export const trackScreen = (screenName: string) => {
    trackEvent('Screen Viewed', { screen: screenName });
};

export const resetAnalytics = () => {
    if (analyticsEnabled && mixpanelInstance) {
        mixpanelInstance.reset();
    }
};

// Predefined events
export const AnalyticsEvents = {
    APP_OPENED: 'App Opened',
    LOGIN: 'User Login',
    SIGNUP: 'User Signup',
    LOGOUT: 'User Logout',
    PACKAGE_DEPOSITED: 'Package Deposited',
    PACKAGE_COLLECTED: 'Package Collected',
    QR_SHOWN: 'QR Code Shown',
    QR_SCANNED: 'QR Code Scanned',
    AI_CHAT_OPENED: 'AI Chat Opened',
    AI_MESSAGE_SENT: 'AI Message Sent',
    BIOMETRIC_USED: 'Biometric Used',
    THEME_TOGGLED: 'Theme Toggled',
    PREMIUM_VIEWED: 'Premium Screen Viewed',
    PREMIUM_PURCHASED: 'Premium Purchased',
    NOTIFICATION_OPENED: 'Notification Opened',
    LOCKER_MAP_OPENED: 'Locker Map Opened',
    PHOTO_CAPTURED: 'Package Photo Captured',
};
