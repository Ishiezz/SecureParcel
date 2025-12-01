import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const StudentDashboard = ({ navigation }) => {
    const { user, logout, packages } = useAuth();
    const { colors: themeColors } = useTheme();

    const dynamicStyles = {
        header: { backgroundColor: themeColors.surface, borderBottomColor: themeColors.border },
        iconBtn: { backgroundColor: themeColors.background },
        badge: { backgroundColor: themeColors.error, borderColor: themeColors.surface },
        card: { backgroundColor: themeColors.surface, borderColor: themeColors.border },
        iconContainer: { backgroundColor: themeColors.background },
        courier: { color: themeColors.textPrimary },
        date: { color: themeColors.textSecondary },
        id: { color: themeColors.textSecondary },
        statusBadge: { backgroundColor: themeColors.primary + '20' },
        statusText: { color: themeColors.primary },
        emptyText: { color: themeColors.textSecondary },
        fab: { backgroundColor: themeColors.primary },
    };

    const myPackages = packages.filter(p => p.status === 'stored');

    const renderPackage = ({ item }) => (
        <View style={[styles.card, dynamicStyles.card]}>
            <View style={styles.cardHeader}>
                <View style={styles.courierInfo}>
                    <View style={[styles.iconContainer, dynamicStyles.iconContainer]}>
                        <MaterialCommunityIcons name="package-variant-closed" size={24} color={themeColors.primary} />
                    </View>
                    <View>
                        <Text style={[styles.courier, dynamicStyles.courier]}>{item.courier}</Text>
                        <Text style={[styles.date, dynamicStyles.date]}>{new Date(item.timestamp).toLocaleDateString()}</Text>
                    </View>
                </View>
                <View style={[styles.statusBadge, dynamicStyles.statusBadge]}>
                    <Text style={[styles.statusText, dynamicStyles.statusText]}>Ready</Text>
                </View>
            </View>
            <View style={styles.cardFooter}>
                <Text style={[styles.id, dynamicStyles.id]}>ID: {item.id}</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color={themeColors.textSecondary} />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header, dynamicStyles.header]}>
                <View>
                    <Text style={[styles.greeting, { color: themeColors.textSecondary }]}>Hello,</Text>
                    <Text style={[styles.username, { color: themeColors.textPrimary }]}>{user?.name || 'Student'}</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={[styles.iconBtn, dynamicStyles.iconBtn]}>
                        <MaterialCommunityIcons name="bell-outline" size={24} color={themeColors.textPrimary} />
                        <View style={[styles.badge, dynamicStyles.badge]} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={[styles.iconBtn, dynamicStyles.iconBtn]}>
                        <MaterialCommunityIcons name="cog-outline" size={24} color={themeColors.textPrimary} />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={myPackages}
                renderItem={renderPackage}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                ListHeaderComponent={
                    <View style={styles.profileCard}>
                        <View style={styles.profileHeader}>
                            <View style={styles.avatarContainer}>
                                <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'S'}</Text>
                            </View>
                            <View style={styles.profileInfo}>
                                <Text style={styles.profileName}>{user?.name || 'Student'}</Text>
                                <Text style={styles.profileId}>ID: {user?.studentId || 'S-XXXX'}</Text>
                                <Text style={styles.profileEmail}>{user?.email || 'student@university.edu'}</Text>
                            </View>
                        </View>

                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{myPackages.length}</Text>
                                <Text style={styles.statLabel}>Waiting</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>0</Text>
                                <Text style={styles.statLabel}>Collected</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{myPackages.length}</Text>
                                <Text style={styles.statLabel}>Total</Text>
                            </View>
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name="package-variant" size={60} color={COLORS.textSecondary} />
                        <Text style={styles.emptyText}>No packages waiting for collection.</Text>
                    </View>
                }
            />
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
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBtn: {
        marginRight: 15,
        padding: 5,
    },
    badge: {
        position: 'absolute',
        top: 5,
        right: 5,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.error,
    },
    logoutBtn: {
        padding: 5,
    },
    list: {
        padding: 20,
    },
    profileCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarText: {
        color: COLORS.white,
        fontSize: 24,
        fontWeight: 'bold',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    profileId: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 2,
    },
    profileEmail: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: COLORS.border,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    courierInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(39, 174, 96, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    courier: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    date: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    statusBadge: {
        backgroundColor: 'rgba(39, 174, 96, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginBottom: 15,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    infoItem: {
        flex: 1,
        alignItems: 'center',
    },
    verticalDivider: {
        width: 1,
        height: '100%',
        backgroundColor: COLORS.border,
    },
    label: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    otpContainer: {
        backgroundColor: COLORS.inputBackground,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
    },
    otpLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 5,
    },
    otpValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.primary,
        letterSpacing: 8,
    },
    instruction: {
        textAlign: 'center',
        color: COLORS.textSecondary,
        fontSize: 12,
        fontStyle: 'italic',
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 50,
        padding: 20,
    },
    emptyText: {
        color: COLORS.textSecondary,
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
    },
});

export default StudentDashboard;
