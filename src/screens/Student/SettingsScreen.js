import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const SettingsScreen = ({ navigation }) => {
    const { user, logout } = useAuth();
    const { colors: COLORS } = useTheme();
    const [isBiometricEnabled, setIsBiometricEnabled] = React.useState(false);

    const renderSettingItem = ({ icon, title, subtitle, onPress, showChevron = true, rightElement }) => (
        <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={icon} size={24} color={COLORS.primary} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.itemTitle}>{title}</Text>
                {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
            </View>
            {rightElement}
            {showChevron && !rightElement && (
                <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    {renderSettingItem({
                        icon: "account-circle-outline",
                        title: user?.name || "Student Name",
                        subtitle: "View Profile",
                        onPress: () => navigation.navigate('Profile')
                    })}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>General</Text>
                    {renderSettingItem({
                        icon: "history",
                        title: "Package History",
                        subtitle: "View past deliveries",
                        onPress: () => navigation.navigate('PackageHistory')
                    })}
                    {renderSettingItem({
                        icon: "bell-outline",
                        title: "Notifications",
                        subtitle: "Manage alerts",
                        onPress: () => navigation.navigate('Notifications')
                    })}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    {renderSettingItem({
                        icon: "help-circle-outline",
                        title: "Help & Support",
                        subtitle: "FAQs and Contact",
                        onPress: () => Alert.alert('Help', 'Contact support at support@secureparcel.com')
                    })}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Security</Text>
                    {renderSettingItem({
                        icon: "fingerprint",
                        title: "Biometric Login",
                        subtitle: "Enable Touch ID / Face ID",
                        showChevron: false,
                        rightElement: (
                            <Switch
                                value={isBiometricEnabled}
                                onValueChange={setIsBiometricEnabled}
                                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                                thumbColor={COLORS.white}
                            />
                        ),
                        onPress: () => setIsBiometricEnabled(!isBiometricEnabled)
                    })}
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <MaterialCommunityIcons name="logout" size={24} color={COLORS.error} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Version 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    itemSubtitle: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        padding: 15,
        borderRadius: 12,
        marginTop: 20,
        borderWidth: 1,
        borderColor: 'rgba(231, 76, 60, 0.3)',
    },
    logoutText: {
        color: COLORS.error,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    versionText: {
        textAlign: 'center',
        color: COLORS.textSecondary,
        fontSize: 12,
        marginTop: 20,
    },
});

export default SettingsScreen;
