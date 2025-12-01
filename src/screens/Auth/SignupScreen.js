import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SignupScreen = ({ navigation, route }) => {
    const { signup } = useAuth();
    const [role, setRole] = useState('student');
    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);

    const handleSignup = () => {
        if (!name || !studentId || !email || !password) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        if (!isTermsAccepted) {
            Alert.alert('Error', 'Please accept the Terms and Privacy Policy');
            return;
        }

        const success = signup({ name, studentId, email, password, role });
        if (success) {
            Alert.alert('Success', 'Account created successfully!', [
                { text: 'OK', onPress: () => navigation.navigate('Login') }
            ]);
        } else {
            Alert.alert('Error', 'User already exists with this Email or ID');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Create New Account</Text>
                    <Text style={styles.subtitle}>
                        Sign up to manage your deliveries
                    </Text>
                </View>



                <View style={styles.form}>
                    <Text style={styles.label}>Full Name</Text>
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons name="account-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your full name"
                            placeholderTextColor={COLORS.textSecondary}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <Text style={styles.label}>
                        {role === 'student' ? 'Student ID' : role === 'delivery' ? 'Delivery ID' : 'Guard ID'}
                    </Text>
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons
                            name={role === 'student' ? "card-account-details-outline" : role === 'delivery' ? "truck-delivery-outline" : "shield-account-outline"}
                            size={20}
                            color={COLORS.textSecondary}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder={`Enter your ${role === 'student' ? 'student' : role === 'delivery' ? 'delivery' : 'guard'} ID`}
                            placeholderTextColor={COLORS.textSecondary}
                            value={studentId}
                            onChangeText={setStudentId}
                            autoCapitalize="characters"
                        />
                    </View>

                    <Text style={styles.label}>Email Address</Text>
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons name="email-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email address"
                            placeholderTextColor={COLORS.textSecondary}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons name="lock-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Create a strong password"
                            placeholderTextColor={COLORS.textSecondary}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!isPasswordVisible}
                        />
                        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                            <MaterialCommunityIcons
                                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                                size={20}
                                color={COLORS.textSecondary}
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.termsContainer}
                        onPress={() => setIsTermsAccepted(!isTermsAccepted)}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons
                            name={isTermsAccepted ? "checkbox-marked" : "checkbox-blank-outline"}
                            size={24}
                            color={isTermsAccepted ? COLORS.primary : COLORS.textSecondary}
                        />
                        <Text style={styles.termsText}>
                            I agree to the <Text style={styles.linkText} onPress={() => navigation.navigate('TermsPrivacy')}>Terms</Text> & <Text style={styles.linkText} onPress={() => navigation.navigate('TermsPrivacy')}>Privacy Policy</Text>
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.signupBtn} onPress={handleSignup}>
                        <Text style={styles.signupText}>Sign Up</Text>
                    </TouchableOpacity>

                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <View style={styles.loginLinkContainer}>
                        <Text style={styles.loginLinkText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginLink}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
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
        color: COLORS.textPrimary,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    roleContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        borderRadius: 10,
        padding: 4,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    roleTab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: COLORS.primary,
    },
    roleText: {
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    activeRoleText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 8,
        marginTop: 10,
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        backgroundColor: COLORS.inputBackground,
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
        color: COLORS.textPrimary,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 5,
    },
    termsText: {
        color: COLORS.textSecondary,
        fontSize: 14,
        marginLeft: 10,
        flex: 1,
    },
    linkText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    signupBtn: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 8,
        marginTop: 30,
        alignItems: 'center',
    },
    signupText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.border,
    },
    dividerText: {
        marginHorizontal: 10,
        color: COLORS.textSecondary,
        fontSize: 14,
        fontWeight: '600',
    },
    loginLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    loginLinkText: {
        color: COLORS.textSecondary,
        fontSize: 16,
    },
    loginLink: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SignupScreen;
