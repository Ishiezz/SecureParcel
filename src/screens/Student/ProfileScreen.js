import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const ProfileScreen = ({ navigation }) => {
    const { user } = useAuth();
    const { colors: COLORS } = useTheme();

    const InfoItem = ({ icon, label, value }) => (
        <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={icon} size={24} color={COLORS.primary} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.avatarSection}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
                    </View>
                    <Text style={styles.name}>{user?.name || 'User Name'}</Text>
                    <Text style={styles.role}>{user?.role?.toUpperCase() || 'STUDENT'}</Text>
                </View>

                <View style={styles.infoSection}>
                    <InfoItem
                        icon="card-account-details-outline"
                        label="Student ID"
                        value={user?.id || 'S-XXXX'}
                    />
                    <View style={styles.divider} />
                    <InfoItem
                        icon="school-outline"
                        label="Department"
                        value={user?.department || 'Not Assigned'}
                    />
                    <View style={styles.divider} />
                    <InfoItem
                        icon="phone-outline"
                        label="Phone Number"
                        value={user?.phone || '+91 XXXXX XXXXX'}
                    />
                    <View style={styles.divider} />
                    <InfoItem
                        icon="email-outline"
                        label="Official Email"
                        value={user?.email || 'student@university.edu'}
                    />
                    <View style={styles.divider} />
                    <InfoItem
                        icon="shield-account-outline"
                        label="Account Status"
                        value="Active"
                    />
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
    avatarSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 4,
        borderColor: 'rgba(52, 152, 219, 0.2)',
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 5,
    },
    role: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: 'bold',
        letterSpacing: 1,
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    infoSection: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
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
    label: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 2,
    },
    value: {
        fontSize: 16,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 5,
    },
});

export default ProfileScreen;
