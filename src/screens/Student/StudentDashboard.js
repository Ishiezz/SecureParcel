import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const StudentDashboard = ({ navigation }) => {
    const { user, logout, packages } = useAuth();
    const { colors: themeColors } = useTheme();

    const dynamicStyles = {
        header: {
            backgroundColor: themeColors.surface,
            borderBottomColor: themeColors.border,
            shadowColor: themeColors.shadow || '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        iconBtn: { backgroundColor: 'transparent' },
        badge: { backgroundColor: themeColors.error, borderColor: themeColors.surface },
        card: { backgroundColor: themeColors.surface, borderColor: themeColors.border },
        iconContainer: { backgroundColor: themeColors.background },
        courier: { color: themeColors.textPrimary },
        date: { color: themeColors.textSecondary },
        id: { color: themeColors.textSecondary },
        statusBadge: { backgroundColor: themeColors.primary + '15' },
        statusText: { color: themeColors.primary },
        emptyText: { color: themeColors.textSecondary },
        fab: { backgroundColor: themeColors.primary },
        profileCard: { backgroundColor: themeColors.surface, borderColor: themeColors.border },
        statValue: { color: themeColors.primary },
        statLabel: { color: themeColors.textSecondary },
        waitingColor: { color: '#9b59b6' },
        collectedColor: { color: '#1abc9c' },
        waitingBadge: { backgroundColor: '#9b59b6' + '20' },
        waitingText: { color: '#9b59b6' },
    };

    const myPackages = packages.filter(p => p.status === 'stored');

    const renderPackage = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, dynamicStyles.card]}
            activeOpacity={0.7}
            onPress={() => { }}
        >
            <View style={styles.cardHeader}>
                <View style={styles.packageInfo}>
                    <Text style={[styles.courier, dynamicStyles.courier]}>{item.courier}</Text>
                    <Text style={[styles.date, dynamicStyles.date]}>Arrived: {new Date(item.timestamp).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}</Text>
                </View>
                <View style={[styles.statusBadge, dynamicStyles.waitingBadge]}>
                    <Text style={[styles.statusText, dynamicStyles.waitingText]}>Ready</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardBody}>
                <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                        <Text style={[styles.label, { color: themeColors.textSecondary }]}>Slot Number</Text>
                        <Text style={[styles.value, { color: themeColors.textPrimary, fontSize: 18 }]}>{item.slot || 'N/A'}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={[styles.label, { color: themeColors.textSecondary }]}>Package ID</Text>
                        <Text style={[styles.value, { color: themeColors.textPrimary }]}>{item.id}</Text>
                    </View>
                </View>

                <View style={styles.otpSection}>
                    <Text style={[styles.otpLabel, { color: themeColors.textSecondary }]}>Collection OTP</Text>
                    <View style={[styles.otpBox, { borderColor: themeColors.primary }]}>
                        <Text style={[styles.otpValue, { color: themeColors.primary }]}>{item.otp}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header, dynamicStyles.header]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color={themeColors.textPrimary} />
                    </TouchableOpacity>

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
                    <View style={[styles.profileCard, dynamicStyles.profileCard]}>
                        <View style={styles.profileHeader}>
                            <View style={styles.avatarContainer}>
                                <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'S'}</Text>
                            </View>
                            <View style={styles.profileInfo}>
                                <Text style={[styles.profileName, { color: themeColors.textPrimary }]}>{user?.name || 'Student'}</Text>
                                <Text style={[styles.profileId, { color: themeColors.textSecondary }]}>ID: {user?.studentId || 'S-XXXX'}</Text>
                                <Text style={[styles.profileEmail, { color: themeColors.textSecondary }]}>{user?.email || 'student@university.edu'}</Text>
                            </View>
                        </View>

                        <View style={[styles.statsRow, { borderTopColor: themeColors.border }]}>
                            <TouchableOpacity
                                style={styles.statItem}
                                onPress={() => navigation.navigate('PackageHistory', { filter: 'waiting' })}
                            >
                                <Text style={[styles.statValue, dynamicStyles.waitingColor]}>{packages.filter(p => p.status === 'stored').length}</Text>
                                <Text style={[styles.statLabel, dynamicStyles.statLabel]}>Waiting</Text>
                            </TouchableOpacity>
                            <View style={[styles.statDivider, { backgroundColor: themeColors.border }]} />
                            <TouchableOpacity
                                style={styles.statItem}
                                onPress={() => navigation.navigate('PackageHistory', { filter: 'collected' })}
                            >
                                <Text style={[styles.statValue, dynamicStyles.collectedColor]}>{packages.filter(p => p.status === 'collected').length}</Text>
                                <Text style={[styles.statLabel, dynamicStyles.statLabel]}>Collected</Text>
                            </TouchableOpacity>
                            <View style={[styles.statDivider, { backgroundColor: themeColors.border }]} />
                            <TouchableOpacity
                                style={styles.statItem}
                                onPress={() => navigation.navigate('PackageHistory', { filter: 'all' })}
                            >
                                <Text style={[styles.statValue, dynamicStyles.statValue]}>{packages.length}</Text>
                                <Text style={[styles.statLabel, dynamicStyles.statLabel]}>Total</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name="package-variant" size={60} color="#B0B0B0" />
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
        backgroundColor: '#121212',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#1E1E1E',
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    headerRight: {
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
        backgroundColor: '#e74c3c',
    },
    logoutBtn: {
        padding: 5,
    },
    list: {
        padding: 20,
    },
    profileCard: {
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 20,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#333333',
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
        backgroundColor: '#D4AF37',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    profileId: {
        fontSize: 14,
        color: '#B0B0B0',
        marginBottom: 2,
    },
    profileEmail: {
        fontSize: 12,
        color: '#B0B0B0',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#333333',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#D4AF37',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#B0B0B0',
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#333333',
    },
    card: {
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#333333',
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
    packageInfo: {
        flex: 1,
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
        color: '#FFFFFF',
    },
    date: {
        fontSize: 12,
        color: '#B0B0B0',
    },
    statusBadge: {
        backgroundColor: 'rgba(39, 174, 96, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#D4AF37',
        fontSize: 12,
        fontWeight: 'bold',
    },
    cardBody: {
        marginTop: 5,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    detailItem: {
        flex: 1,
    },
    otpSection: {
        alignItems: 'center',
        marginTop: 5,
        backgroundColor: '#2C2C2C',
        padding: 10,
        borderRadius: 12,
    },
    otpBox: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 5,
        marginTop: 5,
        borderStyle: 'dashed',
    },
    divider: {
        height: 1,
        backgroundColor: '#333333',
        marginBottom: 15,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 50,
        padding: 20,
    },
    emptyText: {
        color: '#B0B0B0',
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
    },
});

export default StudentDashboard;
