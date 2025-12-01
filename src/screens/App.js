import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from '../context/AuthContext';


import LoginScreen from './Auth/LoginScreen';
import SignupScreen from './Auth/SignupScreen';
import TermsPrivacyScreen from './Auth/TermsPrivacyScreen';
import ForgotPasswordScreen from './Auth/ForgotPasswordScreen';
import StudentDashboard from './Student/StudentDashboard';
import NotificationsScreen from './Student/NotificationsScreen';
import SettingsScreen from './Student/SettingsScreen';
import PackageHistoryScreen from './Student/PackageHistoryScreen';
import ProfileScreen from './Student/ProfileScreen';
import DeliveryDashboard from './Delivery/DeliveryDashboard';
import GuardDashboard from './Guard/GuardDashboard';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const { user } = useAuth();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!user ? (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                    <Stack.Screen name="TermsPrivacy" component={TermsPrivacyScreen} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                </>
            ) : (
                <>
                    {user.role === 'student' && (
                        <>
                            <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
                            <Stack.Screen name="Notifications" component={NotificationsScreen} />
                            <Stack.Screen name="Settings" component={SettingsScreen} />
                            <Stack.Screen name="PackageHistory" component={PackageHistoryScreen} />
                            <Stack.Screen name="Profile" component={ProfileScreen} />
                        </>
                    )}
                    {user.role === 'delivery' && (
                        <Stack.Screen name="DeliveryDashboard" component={DeliveryDashboard} />
                    )}
                    {user.role === 'guard' && (
                        <Stack.Screen name="GuardDashboard" component={GuardDashboard} />
                    )}
                </>
            )}
        </Stack.Navigator>
    );
};

import { SplashProvider, useSplash } from '../context/SplashContext';
import { ThemeProvider } from '../context/ThemeContext';
import SplashScreen from './SplashScreen';

const MainContent = () => {
    const { isShowSplash, setIsShowSplash } = useSplash();

    if (isShowSplash) {
        return <SplashScreen onFinish={() => setIsShowSplash(false)} />;
    }

    return (
        <AuthProvider>
            <ThemeProvider>
                <NavigationContainer>
                    <AppNavigator />
                </NavigationContainer>
            </ThemeProvider>
        </AuthProvider>
    );
};

export default function App() {
    return (
        <SplashProvider>
            <MainContent />
        </SplashProvider>
    );
}
