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
    ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { User as UserIcon, Mail, Lock, Hash, Eye, EyeOff, Briefcase, Phone } from 'lucide-react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { GlassCard } from '../../components/ui/GlassCard';
import * as Haptics from 'expo-haptics';

export const SignupScreen = () => {
    const { theme } = useThemeStore();
    const { signupWithEmail, isLoading, error, clearError } = useAuthStore();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    const initialRole = route.params?.initialRole || 'student';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [idStr, setIdStr] = useState(''); // Student ID, Guard ID, etc.
    const [department, setDepartment] = useState('');
    const [phone, setPhone] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState<'student' | 'delivery' | 'guard'>(initialRole);

    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
        clearError();
    }, []);

    const handleSignup = async () => {
        if (!name || !email || !password || !idStr) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await signupWithEmail({
            name,
            email,
            password,
            id: idStr.toUpperCase(),
            role,
            department,
            phone,
        });
    };

    const getIdPlaceholder = () => {
        switch (role) {
            case 'student': return 'Student ID / Roll No';
            case 'delivery': return 'Agency ID';
            case 'guard': return 'Guard Badge No';
        }
    };

    return (
        <KeyboardAvoidingView 
            style={[styles.container, { backgroundColor: theme.background }]} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <Animated.View style={{ opacity: fadeAnim }}>
                    
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
                        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                            Join SecureParcel today
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
                            <UserIcon size={20} color={theme.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder="Full Name"
                                placeholderTextColor={theme.textSecondary}
                                value={name}
                                onChangeText={(t) => { setName(t); clearError(); }}
                            />
                        </View>

                        <View style={[styles.inputGroup, { backgroundColor: theme.background }]}>
                            <Hash size={20} color={theme.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder={getIdPlaceholder()}
                                placeholderTextColor={theme.textSecondary}
                                value={idStr}
                                onChangeText={(t) => { setIdStr(t); clearError(); }}
                                autoCapitalize="characters"
                            />
                        </View>

                        <View style={[styles.inputGroup, { backgroundColor: theme.background }]}>
                            <Mail size={20} color={theme.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder="Email Address"
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

                        <View style={[styles.inputGroup, { backgroundColor: theme.background }]}>
                            <Phone size={20} color={theme.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder="Phone Number (Optional)"
                                placeholderTextColor={theme.textSecondary}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                        </View>

                        {role === 'student' && (
                            <View style={[styles.inputGroup, { backgroundColor: theme.background }]}>
                                <Briefcase size={20} color={theme.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: theme.text }]}
                                    placeholder="Department / Hostel (Optional)"
                                    placeholderTextColor={theme.textSecondary}
                                    value={department}
                                    onChangeText={setDepartment}
                                />
                            </View>
                        )}

                        <TouchableOpacity
                            style={[styles.signupBtn, { backgroundColor: theme.primary }, (!name || !email || !password || !idStr) && { opacity: 0.7 }]}
                            onPress={handleSignup}
                            disabled={isLoading || !name || !email || !password || !idStr}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={theme.mode === 'dark' ? '#000000' : '#FFFFFF'} />
                            ) : (
                                <Text style={[styles.signupBtnText, { color: theme.mode === 'dark' ? '#000000' : '#FFFFFF' }]}>Create Account</Text>
                            )}
                        </TouchableOpacity>

                    </GlassCard>

                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: theme.textSecondary }]}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={[styles.loginText, { color: theme.primary }]}>Sign In</Text>
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
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
        paddingTop: 60,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
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
    signupBtn: {
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    signupBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
        marginBottom: 40,
    },
    footerText: {
        fontSize: 15,
    },
    loginText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
});
