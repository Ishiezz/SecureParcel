import * as React from 'react';
import{NavigationContainer} from '@react-navigation/native';
import{createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import LockerScreen from '../screens/LockerScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack=createNativeStackNavigator();
export default function AppNavigator(){
    return(
        <NavigatorContainer>
            <Stack.navigator initialRouteName="Login"
            >
                <Stack.Screen name="Login" components={LoginScreen}/>
                <Stack.Screen name="Home" components={HomeScreen}/>
                <Stack.Screen name="Locker" components={LockerScreen}/>
                <Stack.Screen name="Profile" components={ProfileScreen}/>

            </Stack.navigator>
        </NavigatorContainer>
    );
}