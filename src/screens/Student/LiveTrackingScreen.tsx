import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ChevronLeft, MapPin, Package as PackageIcon, Clock, ShieldCheck } from 'lucide-react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { usePackageStore } from '../../store/usePackageStore';
import { StatusTimeline } from '../../components/ui/StatusTimeline';
import { GlassCard } from '../../components/ui/GlassCard';
import { predictPickupETA } from '../../services/aiService';

export const LiveTrackingScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { theme } = useThemeStore();
    const { getPackageById } = usePackageStore();
    
    const packageId = route.params?.packageId;
    const pkg = getPackageById(packageId);

    const [eta, setEta] = useState<string>('Calculating...');

    useEffect(() => {
        if (pkg && pkg.status !== 'collected') {
            predictPickupETA(pkg.id).then(setEta);
        } else {
            setEta('Collected');
        }
    }, [pkg]);

    if (!pkg) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: theme.text }}>Package not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.card }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Live Tracking</Text>
            </View>

            <View style={styles.content}>
                <Text style={[styles.trackingNumber, { color: theme.textSecondary }]}>
                    Tracking Number
                </Text>
                <Text style={[styles.packageId, { color: theme.text }]}>
                    {pkg.id}
                </Text>

                <GlassCard intensity="heavy" style={styles.statusCard}>
                    <View style={styles.courierHeader}>
                        <PackageIcon size={24} color={theme.primary} />
                        <Text style={[styles.courierName, { color: theme.text }]}>{pkg.courier}</Text>
                    </View>
                    <StatusTimeline currentStatus={pkg.status as any} />
                </GlassCard>

                <View style={styles.infoGrid}>
                    <View style={[styles.infoBox, { backgroundColor: theme.card }]}>
                        <Clock size={20} color="#3B82F6" />
                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Estimated Pickup</Text>
                        <Text style={[styles.infoValue, { color: theme.text }]}>{eta}</Text>
                    </View>
                    <View style={[styles.infoBox, { backgroundColor: theme.card }]}>
                        <MapPin size={20} color="#10B981" />
                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Location</Text>
                        <Text style={[styles.infoValue, { color: theme.text }]}>Locker {pkg.slot}</Text>
                    </View>
                </View>

                {pkg.photoUrl && (
                    <View style={styles.photoSection}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Delivery Photo Proof</Text>
                        <Image source={{ uri: pkg.photoUrl }} style={styles.proofPhoto} />
                    </View>
                )}

                <View style={[styles.securitySection, { backgroundColor: theme.primary + '10' }]}>
                    <ShieldCheck size={24} color={theme.primary} />
                    <View style={styles.securityText}>
                        <Text style={[styles.securityTitle, { color: theme.text }]}>Secure Delivery</Text>
                        <Text style={[styles.securityDesc, { color: theme.textSecondary }]}>
                            This package is secured with 256-bit encryption. Present your dynamic QR code or OTP to the guard for collection.
                        </Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 16,
        paddingHorizontal: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        padding: 24,
    },
    trackingNumber: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    packageId: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 4,
        marginBottom: 24,
    },
    statusCard: {
        marginBottom: 24,
    },
    courierHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    courierName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 12,
    },
    infoGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    infoBox: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    infoLabel: {
        fontSize: 12,
        marginTop: 12,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    photoSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    proofPhoto: {
        width: '100%',
        height: 200,
        borderRadius: 16,
    },
    securitySection: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        alignItems: 'flex-start',
    },
    securityText: {
        flex: 1,
        marginLeft: 12,
    },
    securityTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    securityDesc: {
        fontSize: 13,
        lineHeight: 18,
    },
});
