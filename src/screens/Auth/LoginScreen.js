import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useSplash } from '../../context/SplashContext';

import { SafeAreaView } from 'react-native-safe-area-context';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';

const LoginScreen = ({ navigation }) => {
    const { login, getSavedCredentials, biometricEnabled } = useAuth();
    const { setIsShowSplash } = useSplash();
    const [role, setRole] = useState('student');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);

    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            const enrolled = await LocalAuthentication.isEnrolledAsync();
            const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

            if ((compatible && enrolled) || __DEV__) {

                const hasBiometrics = types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT) ||
                    types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION) ||
                    __DEV__;

                if (hasBiometrics) {
                    setIsBiometricSupported(true);
                }
            }
        })();
    }, []);

    const handleBiometricLogin = async () => {
        const savedCredentials = await getSavedCredentials();

        if (!savedCredentials) {
            Alert.alert('Login Required', 'Please login manually first to enable Touch ID.');
            return;
        }

        if (savedCredentials.role !== 'student') {
            Alert.alert('Role Mismatch', 'The saved account is not a Student account. Please login manually.');
            return;
        }

        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Login with Touch ID',
                fallbackLabel: 'Use Password',
                disableDeviceFallback: true,
            });

            if (result.success) {
                const { identifier, password, role, name } = savedCredentials;
                const success = await login(identifier, password, role, name);
                if (!success) {
                    Alert.alert('Error', 'Login failed with saved credentials');
                }
            } else {
                Alert.alert('Auth Failed', 'Biometric authentication was cancelled or failed.');
            }
        } catch (error) {
            console.error('Biometric error:', error);
            Alert.alert('Error', 'Biometric authentication failed: ' + error.message);
        }
    };

    const handleLogin = async () => {
        if (role === 'student' || role === 'delivery' || role === 'guard') {
            if (!email) {
                let roleName = 'Student';
                if (role === 'delivery') roleName = 'Delivery';
                if (role === 'guard') roleName = 'Guard';
                Alert.alert('Error', `Please enter ${roleName} ID`);
                return;
            }

            if (role !== 'student' && !name) {
                Alert.alert('Error', 'Please enter your Name');
                return;
            }

            if (role === 'student' && !password) {
                Alert.alert('Error', 'Please enter Password');
                return;
            }

            const success = await login(email, password, role, name);
            if (!success) {
                Alert.alert('Login Failed', 'Invalid Credentials');
            }
        }
    };

    const getRoleLabel = () => {
        if (role === 'student') return 'Student ID';
        if (role === 'delivery') return 'Delivery ID';
        return 'Guard ID';
    };

    const getRoleIcon = () => {
        if (role === 'student') return "card-account-details-outline";
        if (role === 'delivery') return "truck-delivery-outline";
        return "shield-account-outline";
    };

    const ROLE_COLORS = {
        student: '#D4AF37',
        delivery: '#FFC107',
        guard: '#FFB300'
    };

    const primaryColor = ROLE_COLORS[role];



    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => setIsShowSplash(true)}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
                    </TouchableOpacity>

                    {role === 'student' && (
                        <View style={styles.header}>
                            <Text style={styles.title}>Welcome Back!</Text>
                            <Text style={styles.subtitle}>Your parcels, protected. Your schedule, respected.</Text>
                        </View>
                    )}

                    <View style={styles.roleContainer}>
                        <TouchableOpacity
                            style={[styles.roleTab, role === 'student' && { backgroundColor: ROLE_COLORS.student }]}
                            onPress={() => setRole('student')}
                        >
                            <Text style={[styles.roleText, role === 'student' && styles.activeRoleText]}>Student</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.roleTab, role === 'delivery' && { backgroundColor: ROLE_COLORS.delivery }]}
                            onPress={() => setRole('delivery')}
                        >
                            <Text style={[styles.roleText, role === 'delivery' && styles.activeRoleText]}>Delivery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.roleTab, role === 'guard' && { backgroundColor: ROLE_COLORS.guard }]}
                            onPress={() => setRole('guard')}
                        >
                            <Text style={[styles.roleText, role === 'guard' && styles.activeRoleText]}>Guard</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        {(role === 'delivery' || role === 'guard') && (
                            <>
                                <Text style={styles.label}>Full Name</Text>
                                <View style={styles.inputContainer}>
                                    <MaterialCommunityIcons name="account-outline" size={20} color="#B0B0B0" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your Name"
                                        placeholderTextColor="#B0B0B0"
                                        value={name}
                                        onChangeText={setName}
                                    />
                                </View>
                            </>
                        )}

                        <Text style={styles.label}>{getRoleLabel()}</Text>
                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons
                                name={getRoleIcon()}
                                size={20}
                                color="#B0B0B0"
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder={`Enter your ${getRoleLabel()}`}
                                placeholderTextColor="#B0B0B0"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="characters"
                            />
                        </View>

                        {role === 'student' && (
                            <>
                                <Text style={styles.label}>Password</Text>
                                <View style={styles.inputContainer}>
                                    <MaterialCommunityIcons name="lock-outline" size={20} color="#B0B0B0" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your Password"
                                        placeholderTextColor="#B0B0B0"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!isPasswordVisible}
                                    />
                                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                        <MaterialCommunityIcons
                                            name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                                            size={20}
                                            color="#B0B0B0"
                                        />
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
                                    <Text style={[styles.forgotPasswordText, { color: primaryColor }]}>Forgot Password?</Text>
                                </TouchableOpacity>
                            </>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.loginBtn,
                                { backgroundColor: primaryColor }
                            ]}
                            onPress={handleLogin}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.loginText}>
                                    {role === 'student' ? 'Login' : 'Enter'}
                                </Text>
                                {role !== 'student' && (
                                    <MaterialCommunityIcons
                                        name="arrow-right"
                                        size={20}
                                        color="#FFFFFF"
                                        style={{ marginLeft: 8 }}
                                    />
                                )}
                            </View>
                        </TouchableOpacity>



                        {role === 'student' && isBiometricSupported && biometricEnabled && (
                            <TouchableOpacity
                                style={[styles.biometricBtn, { borderColor: primaryColor }]}
                                onPress={handleBiometricLogin}
                            >
                                <MaterialCommunityIcons name="fingerprint" size={32} color={primaryColor} />
                                <Text style={[styles.biometricText, { color: primaryColor }]}>Login with Touch ID</Text>
                            </TouchableOpacity>
                        )}

                        {role === 'student' && (
                            <>
                                <View style={styles.dividerContainer}>
                                    <View style={styles.dividerLine} />
                                    <Text style={styles.dividerText}>OR</Text>
                                    <View style={styles.dividerLine} />
                                </View>
                                <View style={styles.signupContainer}>
                                    <Text style={styles.signupText}>Don't have an account? </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Signup', { initialRole: role })}>
                                        <Text style={[styles.signupLink, { color: primaryColor }]}>Sign Up</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                    <Text style={styles.footerText}>Secure login • Your data is encrypted</Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
        padding: 8,
        backgroundColor: '#1E1E1E',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 40,
    },
    title: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 19,
        color: '#B0B0B0',
    },
    roleContainer: {
        flexDirection: 'row',
        backgroundColor: '#1E1E1E',
        borderRadius: 10,
        padding: 4,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: '#333333',
    },
    roleTab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    roleText: {
        color: '#B0B0B0',
        fontWeight: '600',
    },
    activeRoleText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    form: {
        backgroundColor: '#1E1E1E',
        padding: 25,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#333333',
    },
    label: {
        fontSize: 16,
        color: '#B0B0B0',
        marginBottom: 8,
        marginTop: 10,
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333333',
        borderRadius: 8,
        backgroundColor: '#2C2C2C',
        paddingHorizontal: 12,
        marginBottom: 5,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: '#FFFFFF',
    },
    infoText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#B0B0B0',
        marginBottom: 20,
        marginTop: 10,
    },
    loginBtn: {
        padding: 16,
        borderRadius: 8,
        marginTop: 30,
        alignItems: 'center',
    },
    loginText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    biometricBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
        borderStyle: 'dashed',
        backgroundColor: 'rgba(52, 152, 219, 0.05)',
    },
    biometricText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#333333',
    },
    dividerText: {
        marginHorizontal: 10,
        color: '#B0B0B0',
        fontSize: 14,
        fontWeight: '600',
    },
    signupText: {
        color: '#B0B0B0',
        fontSize: 14,
    },
    signupLink: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    forgotPassword: {
        alignItems: 'flex-end',
        marginBottom: 20,
        marginTop: 5,
    },
    forgotPasswordText: {
        fontSize: 14,
        fontWeight: '600',
    },
    footerText: {
        textAlign: 'center',
        color: '#B0B0B0',
        fontSize: 12,
        marginTop: 30,
        opacity: 0.7,
    },
});

export default LoginScreen;
