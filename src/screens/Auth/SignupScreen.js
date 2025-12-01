import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SignupScreen = ({ navigation, route }) => {
    const { signup } = useAuth();
    const [role, setRole] = useState('student');
    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [department, setDepartment] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);

    const handleSignup = async () => {
        if (!name || !studentId || !department || !email || !password) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        if (!isTermsAccepted) {
            Alert.alert('Error', 'Please accept the Terms and Privacy Policy');
            return;
        }

        const success = await signup({ name, studentId, department, email, password, role });
        if (!success) {
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
                        <MaterialCommunityIcons name="account-outline" size={20} color="#B0B0B0" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your full name"
                            placeholderTextColor="#B0B0B0"
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
                            color="#B0B0B0"
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder={`Enter your ${role === 'student' ? 'student' : role === 'delivery' ? 'delivery' : 'guard'} ID`}
                            placeholderTextColor="#B0B0B0"
                            value={studentId}
                            onChangeText={setStudentId}
                            autoCapitalize="characters"
                        />
                    </View>

                    <Text style={styles.label}>Department</Text>
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons name="domain" size={20} color="#B0B0B0" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your department"
                            placeholderTextColor="#B0B0B0"
                            value={department}
                            onChangeText={setDepartment}
                        />
                    </View>

                    <Text style={styles.label}>Email Address</Text>
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons name="email-outline" size={20} color="#B0B0B0" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email address"
                            placeholderTextColor="#B0B0B0"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons name="lock-outline" size={20} color="#B0B0B0" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Create a strong password"
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

                    <TouchableOpacity
                        style={styles.termsContainer}
                        onPress={() => setIsTermsAccepted(!isTermsAccepted)}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons
                            name={isTermsAccepted ? "checkbox-marked" : "checkbox-blank-outline"}
                            size={24}
                            color={isTermsAccepted ? "#D4AF37" : "#B0B0B0"}
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
        backgroundColor: '#121212',
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
        color: '#FFFFFF',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#B0B0B0',
    },
    roleContainer: {
        flexDirection: 'row',
        backgroundColor: '#1E1E1E',
        borderRadius: 10,
        padding: 4,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333333',
    },
    roleTab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#D4AF37',
    },
    roleText: {
        color: '#B0B0B0',
        fontWeight: '600',
    },
    activeRoleText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
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
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 5,
    },
    termsText: {
        color: '#B0B0B0',
        fontSize: 14,
        marginLeft: 10,
        flex: 1,
    },
    linkText: {
        color: '#D4AF37',
        fontWeight: 'bold',
    },
    signupBtn: {
        backgroundColor: '#D4AF37',
        padding: 16,
        borderRadius: 8,
        marginTop: 30,
        alignItems: 'center',
    },
    signupText: {
        color: '#FFFFFF',
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
        backgroundColor: '#333333',
    },
    dividerText: {
        marginHorizontal: 10,
        color: '#B0B0B0',
        fontSize: 14,
        fontWeight: '600',
    },
    loginLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    loginLinkText: {
        color: '#B0B0B0',
        fontSize: 16,
    },
    loginLink: {
        color: '#D4AF37',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SignupScreen;
