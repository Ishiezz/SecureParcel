import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { User, Bell, Shield, LogOut, ChevronRight, Crown, Settings, Fingerprint, Lock } from 'lucide-react-native';
import { GlassCard } from '../../components/ui/GlassCard';
import * as Haptics from 'expo-haptics';
import * as LocalAuthentication from 'expo-local-authentication';

export default function ProfileScreen() {
    const { theme } = useThemeStore();
    const { user, logout, biometricEnabled, setBiometricEnabled } = useAuthStore();
    const navigation = useNavigation<any>();

    const [hasBiometricHW, setHasBiometricHW] = useState(false);

    React.useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setHasBiometricHW(compatible);
        })();
    }, []);

    const handleLogout = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        logout();
    };

    const handleBiometricToggle = async (value: boolean) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (value) {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate to enable biometric login',
            });
            if (result.success) {
                setBiometricEnabled(true);
            }
        } else {
            setBiometricEnabled(false);
        }
    };

    const isPremium = user?.premiumTier === 'premium';

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.card }]}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
            </View>

            <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                    <View style={[styles.avatar, { backgroundColor: theme.primary + '20' }]}>
                        <User size={40} color={theme.primary} />
                    </View>
                    {isPremium && (
                        <View style={styles.premiumBadge}>
                            <Crown size={12} color="#fff" />
                        </View>
                    )}
                </View>
                <Text style={[styles.name, { color: theme.text }]}>{user?.name}</Text>
                <Text style={[styles.email, { color: theme.textSecondary }]}>{user?.email}</Text>
                
                {!isPremium && (
                    <TouchableOpacity 
                        style={styles.upgradeBtn}
                        onPress={() => navigation.navigate('Premium')}
                    >
                        <Crown size={16} color="#F59E0B" />
                        <Text style={styles.upgradeText}>Upgrade to Premium</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Account</Text>
                <GlassCard intensity="light" style={styles.settingsCard}>
                    <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('Settings')}>
                        <View style={styles.settingLeft}>
                            <Settings size={20} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>General Settings</Text>
                        </View>
                        <ChevronRight size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                    
                    <View style={styles.divider} />

                    <View style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Bell size={20} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>Push Notifications</Text>
                        </View>
                        <Switch 
                            value={true} 
                            onValueChange={() => {}} 
                            trackColor={{ false: theme.border, true: theme.primary }}
                        />
                    </View>
                </GlassCard>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Security</Text>
                <GlassCard intensity="light" style={styles.settingsCard}>
                    {hasBiometricHW && (
                        <>
                            <View style={styles.settingRow}>
                                <View style={styles.settingLeft}>
                                    <Fingerprint size={20} color={theme.text} />
                                    <Text style={[styles.settingText, { color: theme.text }]}>Biometric Login</Text>
                                </View>
                                <Switch 
                                    value={biometricEnabled} 
                                    onValueChange={handleBiometricToggle}
                                    trackColor={{ false: theme.border, true: theme.primary }}
                                />
                            </View>
                            <View style={styles.divider} />
                        </>
                    )}

                    <TouchableOpacity style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Lock size={20} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>Change Password</Text>
                        </View>
                        <ChevronRight size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                </GlassCard>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <LogOut size={20} color="#EF4444" />
                <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>

            <Text style={[styles.versionText, { color: theme.textSecondary }]}>Version 3.0.0</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    premiumBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#F59E0B',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        marginBottom: 16,
    },
    upgradeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    upgradeText: {
        color: '#F59E0B',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    section: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 12,
        marginLeft: 8,
    },
    settingsCard: {
        padding: 0,
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingText: {
        fontSize: 16,
        marginLeft: 12,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginLeft: 48,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 24,
        marginTop: 16,
        marginBottom: 32,
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#FEE2E2',
    },
    logoutText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        marginBottom: 40,
    },
});
