import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
    const { colors } = useThemeStore();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert('Success', 'Password reset link sent to your email!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            console.error(error);
            Alert.alert('Notice', 'If this email is registered, a reset link will be sent.');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.glassBackground, { backgroundColor: colors.background }]} />
            <View style={[styles.blob, { backgroundColor: colors.primary, top: -100, left: -50 }]} />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Forgot Password</Text>
                </View>

                <ScrollView 
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.iconWrapper}>
                        <MaterialCommunityIcons name="lock-reset" size={64} color={colors.primary} />
                    </View>
                    <Text style={[styles.description, { color: colors.textSecondary }]}>
                        Enter your email address and we'll send you a link to reset your password.
                    </Text>

                    <View style={[styles.form, { borderColor: colors.glassBorder, backgroundColor: 'rgba(255,255,255,0.03)' }]}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Email Address</Text>
                        <View style={[styles.inputContainer, { borderColor: colors.glassBorder, backgroundColor: 'rgba(0,0,0,0.2)' }]}>
                            <MaterialCommunityIcons name="email-outline" size={20} color="#B0B0B0" style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: colors.textPrimary }]}
                                placeholder="Enter your email address"
                                placeholderTextColor="#888"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <TouchableOpacity 
                            style={[styles.resetBtn, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]} 
                            onPress={handleResetPassword}
                            disabled={loading}
                        >
                            <Text style={[styles.resetBtnText, { color: colors.mode === 'dark' ? '#000000' : '#FFFFFF' }]}>{loading ? 'Sending...' : 'Send Reset Link'}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    glassBackground: {
        ...StyleSheet.absoluteFillObject,
    },
    blob: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.15,
        filter: 'blur(50px)' as any,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backButton: {
        marginRight: 15,
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 40,
        alignItems: 'center',
    },
    iconWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.03)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    form: {
        width: '100%',
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    label: {
        fontSize: 13,
        marginBottom: 8,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        marginBottom: 24,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        height: '100%',
    },
    resetBtn: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
    },
    resetBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});

export default ForgotPasswordScreen;
