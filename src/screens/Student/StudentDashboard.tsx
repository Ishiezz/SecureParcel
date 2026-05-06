import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { usePackageStore } from '../../store/usePackageStore';
import { Package } from '../../types';
import { AnimatedCard } from '../../components/ui/AnimatedCard';
import { DynamicQRCode } from '../../components/ui/DynamicQRCode';
import { EmptyState } from '../../components/ui/EmptyState';
import { MapPin, Bell, Package as PackageIcon, ShieldCheck } from 'lucide-react-native';
import { format } from 'date-fns';

export default function StudentDashboard() {
    const { theme } = useThemeStore();
    const { user } = useAuthStore();
    const { packages, fetchUserPackages, isLoading } = usePackageStore();
    const navigation = useNavigation<any>();

    useFocusEffect(
        useCallback(() => {
            fetchUserPackages();
        }, [fetchUserPackages])
    );

    const activePackages = packages.filter(p => p.status === 'stored' || p.status === 'pending');
    
    // Most recent active package or just the first one
    const featuredPackage = activePackages.length > 0 ? activePackages[0] : null;

    const renderFeaturedPackage = (pkg: Package) => (
        <AnimatedCard style={styles.featuredCard} onPress={() => navigation.navigate('LiveTracking', { packageId: pkg.id })}>
            <View style={styles.cardHeader}>
                <View style={styles.courierInfo}>
                    <PackageIcon size={20} color={theme.primary} />
                    <Text style={[styles.courierText, { color: theme.textPrimary }]}>{pkg.courier}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: theme.primary + '20' }]}>
                    <Text style={[styles.statusText, { color: theme.primary }]}>{pkg.status.toUpperCase()}</Text>
                </View>
            </View>
            
            <View style={styles.locationInfo}>
                <MapPin size={16} color={theme.textSecondary} />
                <Text style={[styles.locationText, { color: theme.textSecondary }]}>Locker {pkg.slot}</Text>
            </View>

            <Text style={[styles.pinText, { color: theme.textPrimary }]}>PIN: {pkg.otp}</Text>

            <View style={styles.qrContainer}>
                <DynamicQRCode data={pkg.id} />
            </View>

            <Text style={[styles.instructionText, { color: theme.textSecondary }]}>
                Show this QR code at the locker scanner or to the guard.
            </Text>
        </AnimatedCard>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.surface }]}>
                <View>
                    <Text style={[styles.greeting, { color: theme.textSecondary }]}>Hello,</Text>
                    <Text style={[styles.name, { color: theme.textPrimary }]}>{user?.name}</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Premium')}>
                        <ShieldCheck size={24} color="#F59E0B" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Notifications')}>
                        <Bell size={24} color={theme.textPrimary} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchUserPackages} tintColor={theme.primary} />}
            >
                {activePackages.length > 0 ? (
                    <>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Ready for Pickup</Text>
                            <Text style={[styles.sectionCount, { color: theme.primary }]}>{activePackages.length}</Text>
                        </View>
                        {featuredPackage && renderFeaturedPackage(featuredPackage)}

                        {activePackages.length > 1 && (
                            <View style={styles.otherPackages}>
                                <Text style={[styles.sectionTitle, { color: theme.textPrimary, marginBottom: 12 }]}>Other Packages</Text>
                                {activePackages.slice(1).map(pkg => (
                                    <AnimatedCard key={pkg.id} style={styles.miniCard} onPress={() => navigation.navigate('LiveTracking', { packageId: pkg.id })}>
                                        <View style={styles.miniCardContent}>
                                            <PackageIcon size={24} color={theme.primary} />
                                            <View style={styles.miniCardText}>
                                                <Text style={[styles.miniCourier, { color: theme.textPrimary }]}>{pkg.courier}</Text>
                                                <Text style={[styles.miniSlot, { color: theme.textSecondary }]}>Locker {pkg.slot}</Text>
                                            </View>
                                            <Text style={[styles.miniTime, { color: theme.textSecondary }]}>
                                                {format(new Date(pkg.createdAt), 'HH:mm')}
                                            </Text>
                                        </View>
                                    </AnimatedCard>
                                ))}
                            </View>
                        )}
                    </>
                ) : (
                    <View style={styles.emptyContainer}>
                        <EmptyState type="packages" />
                    </View>
                )}
            </ScrollView>

            <TouchableOpacity 
                style={[styles.aiFab, { backgroundColor: theme.primary }]}
                onPress={() => navigation.navigate('AIChat')}
            >
                <Text style={[styles.aiFabText, { color: theme.mode === 'dark' ? '#000000' : '#FFFFFF' }]}>Ask AI ✨</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        zIndex: 10,
    },
    greeting: {
        fontSize: 14,
        fontWeight: '500',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 4,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    actionBtn: {
        padding: 4,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 100, // Space for FAB and TabBar
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    sectionCount: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 8,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    featuredCard: {
        marginBottom: 24,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    courierInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    courierText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    locationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    locationText: {
        fontSize: 14,
        marginLeft: 6,
    },
    pinText: {
        fontSize: 28,
        fontWeight: 'bold',
        letterSpacing: 2,
        textAlign: 'center',
        marginBottom: 24,
    },
    qrContainer: {
        alignItems: 'center',
        marginVertical: 16,
    },
    instructionText: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 16,
    },
    otherPackages: {
        marginTop: 8,
    },
    miniCard: {
        padding: 16,
        marginBottom: 12,
    },
    miniCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    miniCardText: {
        flex: 1,
        marginLeft: 12,
    },
    miniCourier: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    miniSlot: {
        fontSize: 13,
        marginTop: 2,
    },
    miniTime: {
        fontSize: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        minHeight: 400,
    },
    aiFab: {
        position: 'absolute',
        bottom: 90, // Above tab bar
        right: 24,
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 28,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        zIndex: 100,
    },
    aiFabText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
