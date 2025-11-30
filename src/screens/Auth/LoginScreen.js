import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = ({ navigation }) => {
    const { login } = useAuth();
    const [role, setRole] = useState('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (role === 'student') {
            if (!email || !password) {
                Alert.alert('Error', 'Please enter Student ID and Password');
                return;
            }
            const success = login(email, password, 'student');
            if (!success) {
                Alert.alert('Login Failed', 'Invalid Credentials');
            }
        } else {
            login(null, null, role);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>SecureParcel</Text>
                        <Text style={styles.subtitle}>Campus Delivery Management</Text>
                    </View>

                    <View style={styles.roleContainer}>
                        <TouchableOpacity
                            style={[styles.roleTab, role === 'student' && styles.activeTab]}
                            onPress={() => setRole('student')}
                        >
                            <Text style={[styles.roleText, role === 'student' && styles.activeRoleText]}>Student</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.roleTab, role === 'delivery' && styles.activeTab]}
                            onPress={() => setRole('delivery')}
                        >
                            <Text style={[styles.roleText, role === 'delivery' && styles.activeRoleText]}>Delivery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.roleTab, role === 'guard' && styles.activeTab]}
                            onPress={() => setRole('guard')}
                        >
                            <Text style={[styles.roleText, role === 'guard' && styles.activeRoleText]}>Guard</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        {role === 'student' ? (
                            <>
                                <Text style={styles.label}>Student ID</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. S123"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="characters"
                                />

                                <Text style={styles.label}>Password</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </>
                        ) : (
                            <Text style={styles.infoText}>
                                Login as {role === 'delivery' ? 'Delivery Partner' : 'Security Guard'}
                            </Text>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.loginBtn,
                                role === 'delivery' && styles.deliveryBtn,
                                role === 'guard' && styles.guardBtn
                            ]}
                            onPress={handleLogin}
                        >
                            <Text style={styles.loginText}>Login</Text>
                        </TouchableOpacity>

                        {role === 'student' && (
                            <View style={styles.signupContainer}>
                                <Text style={styles.signupText}>Don't have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                    <Text style={styles.signupLink}>Sign Up</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#7f8c8d',
    },
    roleContainer: {
        flexDirection: 'row',
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        padding: 4,
        marginBottom: 30,
    },
    roleTab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    roleText: {
        color: '#7f8c8d',
        fontWeight: '600',
    },
    activeRoleText: {
        color: '#2c3e50',
        fontWeight: 'bold',
    },
    form: {
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        color: '#34495e',
        marginBottom: 8,
        marginTop: 10,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#bdc3c7',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fafafa',
    },
    infoText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#7f8c8d',
        marginBottom: 20,
        marginTop: 10,
    },
    loginBtn: {
        backgroundColor: '#3498db',
        padding: 16,
        borderRadius: 8,
        marginTop: 30,
        alignItems: 'center',
    },
    deliveryBtn: {
        backgroundColor: '#e67e22',
    },
    guardBtn: {
        backgroundColor: '#27ae60',
    },
    loginText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signupText: {
        color: '#7f8c8d',
        fontSize: 16,
    },
    signupLink: {
        color: '#3498db',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
