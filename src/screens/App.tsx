import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Platform, AppState } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';

import { Home, History, Bell, User, Map, Activity } from 'lucide-react-native';

// Auth Screens
import { LoginScreen } from './Auth/LoginScreen';
import { SignupScreen } from './Auth/SignupScreen';
import ForgotPasswordScreen from './Auth/ForgotPasswordScreen';

// Common Screens
import { OnboardingScreen } from './Common/OnboardingScreen';
import { PremiumScreen } from './Common/PremiumScreen';
import { LockerMapScreen } from './Common/LockerMapScreen';

// Student Screens
import StudentDashboard from './Student/StudentDashboard';
import AIChatScreen from './Student/AIChatScreen';
import NotificationsScreen from './Student/NotificationsScreen';
import SettingsScreen from './Student/SettingsScreen';
import PackageHistoryScreen from './Student/PackageHistoryScreen';
import ProfileScreen from './Student/ProfileScreen';
import { LiveTrackingScreen } from './Student/LiveTrackingScreen';
import { AnalyticsDashboardScreen } from './Student/AnalyticsDashboardScreen';

// Delivery Screens
import DeliveryDashboard from './Delivery/DeliveryDashboard';
import { PackagePhotoScreen } from './Delivery/PackagePhotoScreen';
import { DeliveryHistoryScreen } from './Delivery/DeliveryHistoryScreen';

// Guard Screens
import GuardDashboard from './Guard/GuardDashboard';
import { ActivityLogScreen } from './Guard/ActivityLogScreen';

import SplashScreen from './SplashScreen';
import { ToastNotification } from '../components/ui/ToastNotification';

// Services
import { initSentry } from '../services/sentryService';
import { initRevenueCat } from '../services/revenueCatService';
import { initAnalytics, trackEvent, AnalyticsEvents } from '../services/analyticsService';
import { requestPushPermissions } from '../services/pushNotificationService';
import { socketService } from '../services/socketService';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- Initialization ---
initSentry();
initRevenueCat();
initAnalytics();

const StudentTabs = () => {
    const { theme } = useThemeStore();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: Platform.OS === 'ios' ? 24 : 16,
                    left: 20,
                    right: 20,
                    height: 64,
                    backgroundColor: theme.card,
                    borderTopWidth: 0,
                    borderRadius: 32,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    elevation: 10,
                    paddingBottom: 0,
                },
                tabBarShowLabel: false,
                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: theme.textSecondary,
            }}
        >
            <Tab.Screen 
                name="Home" 
                component={StudentDashboard} 
                options={{ tabBarIcon: ({ color }) => <Home size={24} color={color} /> }}
            />
            <Tab.Screen 
                name="History" 
                component={PackageHistoryScreen} 
                options={{ tabBarIcon: ({ color }) => <History size={24} color={color} /> }}
            />
            <Tab.Screen 
                name="LockerMap" 
                component={LockerMapScreen} 
                options={{ tabBarIcon: ({ color }) => <Map size={24} color={color} /> }}
            />
            <Tab.Screen 
                name="Analytics" 
                component={AnalyticsDashboardScreen} 
                options={{ tabBarIcon: ({ color }) => <Activity size={24} color={color} /> }}
            />
            <Tab.Screen 
                name="Profile" 
                component={ProfileScreen} 
                options={{ tabBarIcon: ({ color }) => <User size={24} color={color} /> }}
            />
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    const user = useAuthStore(state => state.user);

    return (
        <Stack.Navigator 
            screenOptions={{ 
                headerShown: false, 
                animation: 'fade_from_bottom',
                animationTypeForReplace: 'push',
                gestureEnabled: true,
            }}
        >
            {!user ? (
                <>
                    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                </>
            ) : (
                <>
                    {user.role === 'student' && (
                        <>
                            <Stack.Screen name="StudentRoot" component={StudentTabs} />
                            <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} />
                            <Stack.Screen name="AIChat" component={AIChatScreen} />
                            <Stack.Screen name="Notifications" component={NotificationsScreen} />
                            <Stack.Screen name="Settings" component={SettingsScreen} />
                            <Stack.Screen name="Premium" component={PremiumScreen} />
                        </>
                    )}
                    {user.role === 'delivery' && (
                        <>
                            <Stack.Screen name="DeliveryRoot" component={DeliveryDashboard} />
                            <Stack.Screen name="PackagePhoto" component={PackagePhotoScreen} />
                            <Stack.Screen name="DeliveryHistory" component={DeliveryHistoryScreen} />
                        </>
                    )}
                    {user.role === 'guard' && (
                        <>
                            <Stack.Screen name="GuardRoot" component={GuardDashboard} />
                            <Stack.Screen name="ActivityLog" component={ActivityLogScreen} />
                        </>
                    )}
                </>
            )}
        </Stack.Navigator>
    );
};

export default function App() {
    const [isShowSplash, setIsShowSplash] = useState(true);
    const { user } = useAuthStore();
    const { theme, setThemeByRole } = useThemeStore();
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as any });

    useEffect(() => {
        // App wide initializations
        requestPushPermissions();
        trackEvent(AnalyticsEvents.APP_OPENED);

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active') {
                socketService.connect();
            } else {
                socketService.disconnect();
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        setThemeByRole(user?.role);
    }, [user]);

    if (isShowSplash) {
        return <SplashScreen onFinish={() => setIsShowSplash(false)} />;
    }

    const baseTheme = theme.mode === 'dark' ? DarkTheme : DefaultTheme;
    const navigationTheme = {
        ...baseTheme,
        colors: {
            ...baseTheme.colors,
            primary: theme.primary,
            background: theme.background,
            card: theme.card,
            text: theme.text,
            border: theme.border,
            notification: theme.primary,
        },
    };

    return (
        <NavigationContainer theme={navigationTheme}>
            <AppNavigator />
            <ToastNotification 
                visible={toast.visible} 
                message={toast.message} 
                type={toast.type} 
                onHide={() => setToast(t => ({ ...t, visible: false }))} 
            />
        </NavigationContainer>
    );
}
