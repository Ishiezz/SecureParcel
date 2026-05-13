// ============================================================
// Sentry Service — Error tracking with console fallback
// ============================================================

let sentryEnabled = false;
let SentryModule: any = null;

export const initSentry = async () => {
    const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
    if (!dsn || dsn === 'YOUR_SENTRY_DSN' || dsn === 'your_sentry_dsn_here' || !dsn.startsWith('http')) {
        console.log('[Sentry] Not configured — using console fallback');
        return;
    }
    try {
        SentryModule = await import('@sentry/react-native');
        SentryModule.init({
            dsn,
            enableAutoSessionTracking: true,
            sessionTrackingIntervalMillis: 30000,
            tracesSampleRate: 1.0,
            environment: __DEV__ ? 'development' : 'production',
            beforeSend(event: any) {
                // Scrub sensitive data
                if (event.request?.cookies) delete event.request.cookies;
                return event;
            },
        });
        sentryEnabled = true;
        console.log('[Sentry] Initialized');
    } catch {
        console.log('[Sentry] Package not available — using console fallback');
    }
};

export const captureException = (error: Error | unknown, context?: Record<string, any>) => {
    if (sentryEnabled && SentryModule) {
        if (context) {
            SentryModule.withScope((scope: any) => {
                Object.entries(context).forEach(([key, value]) => scope.setExtra(key, value));
                SentryModule.captureException(error);
            });
        } else {
            SentryModule.captureException(error);
        }
    } else {
        console.error('[Sentry Error]', error, context || {});
    }
};

export const setSentryUser = (user: { id: string; email?: string; role?: string } | null) => {
    if (sentryEnabled && SentryModule) {
        SentryModule.setUser(user);
    }
};

export const addBreadcrumb = (category: string, message: string, data?: Record<string, any>) => {
    if (sentryEnabled && SentryModule) {
        SentryModule.addBreadcrumb({ category, message, data, level: 'info' });
    }
};

export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
    if (sentryEnabled && SentryModule) {
        SentryModule.captureMessage(message, level);
    } else {
        console.log(`[Sentry ${level.toUpperCase()}]`, message);
    }
};
