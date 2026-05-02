import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Animated,
    Image,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Package, Mail, Lock, Fingerprint, Eye, EyeOff } from 'lucide-react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { GlassCard } from '../../components/ui/GlassCard';
import * as Haptics from 'expo-haptics';

export const LoginScreen = () => {
    const { theme } = useThemeStore();
    const { loginWithEmail, loginWithBiometric, isLoading, error, clearError, biometricEnabled } = useAuthStore();
    const navigation = useNavigation<any>();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState<'student' | 'delivery' | 'guard'>('student');

    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const slideAnim = React.useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
        ]).start();
        clearError();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await loginWithEmail(email, password, role);
    };

    const handleBiometric = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const success = await loginWithBiometric();
        if (success) {
            // Bio success — in a real app this would use a stored token
            // For now, it bypasses if credentials exist in store
        }
    };

    return (
        <KeyboardAvoidingView 
            style={[styles.container, { backgroundColor: theme.background }]} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 40 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                
                <View style={styles.header}>
                    <View style={[styles.logoContainer, { backgroundColor: theme.primary + '20' }]}>
                        <Package size={48} color={theme.primary} />
                    </View>
                    <Text style={[styles.title, { color: theme.text }]}>Welcome Back</Text>
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        Sign in to your SecureParcel account
                    </Text>
                </View>

                <GlassCard intensity="light" style={styles.formCard}>
                    {/* Role Selector */}
                    <View style={[styles.roleSelector, { backgroundColor: theme.background }]}>
                        {['student', 'delivery', 'guard'].map((r) => (
                            <TouchableOpacity
                                key={r}
                                style={[
                                    styles.roleBtn,
                                    role === r && { backgroundColor: theme.primary },
                                ]}
                                onPress={() => { setRole(r as any); Haptics.selectionAsync(); }}
                            >
                                <Text style={[
                                    styles.roleText,
                                    { color: role === r ? (theme.mode === 'dark' ? '#000000' : '#FFFFFF') : theme.textSecondary },
                                    role === r && { fontWeight: 'bold' }
                                ]}>
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <View style={[styles.inputGroup, { backgroundColor: theme.background }]}>
                        <Mail size={20} color={theme.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { color: theme.text }]}
                            placeholder="Email or ID"
                            placeholderTextColor={theme.textSecondary}
                            value={email}
                            onChangeText={(t) => { setEmail(t); clearError(); }}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={[styles.inputGroup, { backgroundColor: theme.background }]}>
                        <Lock size={20} color={theme.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { color: theme.text }]}
                            placeholder="Password"
                            placeholderTextColor={theme.textSecondary}
                            value={password}
                            onChangeText={(t) => { setPassword(t); clearError(); }}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                            {showPassword ? (
                                <EyeOff size={20} color={theme.textSecondary} />
                            ) : (
                                <Eye size={20} color={theme.textSecondary} />
                            )}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.forgotBtn} onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={[styles.forgotText, { color: theme.primary }]}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.loginBtn, { backgroundColor: theme.primary }, (!email || !password) && { opacity: 0.7 }]}
                        onPress={handleLogin}
                        disabled={isLoading || !email || !password}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={theme.mode === 'dark' ? '#000000' : '#FFFFFF'} />
                        ) : (
                            <Text style={[styles.loginBtnText, { color: theme.mode === 'dark' ? '#000000' : '#FFFFFF' }]}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    {biometricEnabled && (
                        <TouchableOpacity style={styles.bioBtn} onPress={handleBiometric}>
                            <Fingerprint size={24} color={theme.textSecondary} />
                            <Text style={[styles.bioText, { color: theme.textSecondary }]}>Sign in with Biometrics</Text>
                        </TouchableOpacity>
                    )}
                </GlassCard>

                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: theme.textSecondary }]}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup', { initialRole: role })}>
                        <Text style={[styles.signupText, { color: theme.primary }]}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
    },
    formCard: {
        padding: 24,
    },
    roleSelector: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
    },
    roleBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    roleText: {
        fontSize: 14,
        fontWeight: '500',
    },
    errorContainer: {
        backgroundColor: '#FEE2E2',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 14,
        textAlign: 'center',
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        height: '100%',
    },
    eyeIcon: {
        padding: 8,
    },
    forgotBtn: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotText: {
        fontSize: 14,
        fontWeight: '600',
    },
    loginBtn: {
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    loginBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bioBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
    },
    bioText: {
        marginLeft: 8,
        fontSize: 15,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
    },
    footerText: {
        fontSize: 15,
    },
    signupText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
});
