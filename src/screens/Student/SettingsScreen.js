import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';


const SettingsScreen = ({ navigation }) => {
    const { user, logout, biometricEnabled, toggleBiometric } = useAuth();

    const renderSettingItem = ({ icon, title, subtitle, onPress, showChevron = true, rightElement }) => (
        <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={icon} size={24} color="#D4AF37" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.itemTitle}>{title}</Text>
                {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
            </View>
            {rightElement}
            {showChevron && !rightElement && (
                <MaterialCommunityIcons name="chevron-right" size={24} color="#B0B0B0" />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
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
                                value={biometricEnabled}
                                onValueChange={toggleBiometric}
                                trackColor={{ false: '#333333', true: '#D4AF37' }}
                                thumbColor="#FFFFFF"
                            />
                        ),
                        onPress: toggleBiometric
                    })}
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <MaterialCommunityIcons name="logout" size={24} color="#CF6679" />
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
        backgroundColor: '#121212',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#1E1E1E',
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
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
        color: '#B0B0B0',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#333333',
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
        color: '#FFFFFF',
    },
    itemSubtitle: {
        fontSize: 12,
        color: '#B0B0B0',
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
        color: '#CF6679',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    versionText: {
        textAlign: 'center',
        color: '#B0B0B0',
        fontSize: 12,
        marginTop: 20,
    },
});

export default SettingsScreen;
