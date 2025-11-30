import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from '../context/AuthContext';


import LoginScreen from './Auth/LoginScreen';
import SignupScreen from './Auth/SignupScreen';
import StudentDashboard from './Student/StudentDashboard';
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
                </>
            ) : (
                <>
                    {user.role === 'student' && (
                        <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
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

import SplashScreen from './SplashScreen';

export default function App() {
    const [isShowSplash, setIsShowSplash] = React.useState(true);

    if (isShowSplash) {
        return <SplashScreen onFinish={() => setIsShowSplash(false)} />;
    }

    return (
        <AuthProvider>
            <NavigationContainer>
                <AppNavigator />
            </NavigationContainer>
        </AuthProvider>
    );
}
