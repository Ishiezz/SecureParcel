import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Crown, CheckCircle2, ShieldCheck, Zap, X } from 'lucide-react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { purchasePackage, getOfferings, restorePurchases } from '../../services/revenueCatService';
import { GlassCard } from '../../components/ui/GlassCard';
import * as Haptics from 'expo-haptics';

export const PremiumScreen = () => {
    const { theme } = useThemeStore();
    const { user, updatePremiumTier } = useAuthStore();
    const navigation = useNavigation();
    
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

    const FEATURES = [
        { icon: ShieldCheck, title: 'Priority Lockers', desc: 'Never wait. Always get a locker reserved.' },
        { icon: Zap, title: 'Unlimited AI Chat', desc: 'No daily limits on the smart assistant.' },
        { icon: CheckCircle2, title: '90-Day History', desc: 'Keep track of all your deliveries longer.' },
        { icon: Crown, title: '14-Day Storage', desc: 'Double the free time before packages expire.' },
    ];

    const handlePurchase = async () => {
        setIsLoading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        try {
            const success = await purchasePackage(selectedPlan === 'yearly' ? 'premium_yearly' : 'premium_monthly');
            if (success) {
                updatePremiumTier('premium');
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                navigation.goBack();
            }
        } catch (error) {
            console.error('Purchase failed', error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestore = async () => {
        setIsLoading(true);
        try {
            const tier = await restorePurchases();
            if (tier === 'premium') {
                updatePremiumTier('premium');
                navigation.goBack();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const isDark = theme.mode === 'dark';

    return (
        <ScrollView style={[styles.container, { backgroundColor: isDark ? '#0f172a' : '#f8fafc' }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                <X size={24} color={theme.text} />
            </TouchableOpacity>

            <View style={styles.header}>
                <Crown size={64} color="#F59E0B" />
                <Text style={[styles.title, { color: theme.text }]}>SecureParcel Premium</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    Unlock the ultimate campus delivery experience.
                </Text>
            </View>

            <View style={styles.featuresList}>
                {FEATURES.map((feature, i) => {
                    const Icon = feature.icon;
                    return (
                        <View key={i} style={styles.featureItem}>
                            <View style={styles.iconBox}>
                                <Icon size={24} color="#F59E0B" />
                            </View>
                            <View style={styles.featureText}>
                                <Text style={[styles.featureTitle, { color: theme.text }]}>{feature.title}</Text>
                                <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>{feature.desc}</Text>
                            </View>
                        </View>
                    );
                })}
            </View>

            <View style={styles.plansContainer}>
                <TouchableOpacity onPress={() => setSelectedPlan('monthly')} activeOpacity={0.8}>
                    <GlassCard 
                        intensity={selectedPlan === 'monthly' ? 'heavy' : 'light'}
                        style={[
                            styles.planCard, 
                            selectedPlan === 'monthly' && { borderColor: '#F59E0B', borderWidth: 2 }
                        ]}
                    >
                        <Text style={[styles.planTitle, { color: theme.text }]}>Monthly</Text>
                        <Text style={[styles.planPrice, { color: theme.text }]}>₹99<Text style={styles.planDuration}>/mo</Text></Text>
                    </GlassCard>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setSelectedPlan('yearly')} activeOpacity={0.8}>
                    <GlassCard 
                        intensity={selectedPlan === 'yearly' ? 'heavy' : 'light'}
                        style={[
                            styles.planCard, 
                            selectedPlan === 'yearly' && { borderColor: '#F59E0B', borderWidth: 2 }
                        ]}
                    >
                        <View style={styles.saveBadge}>
                            <Text style={styles.saveText}>SAVE 50%</Text>
                        </View>
                        <Text style={[styles.planTitle, { color: theme.text }]}>Yearly</Text>
                        <Text style={[styles.planPrice, { color: theme.text }]}>₹599<Text style={styles.planDuration}>/yr</Text></Text>
                        <Text style={[styles.planSub, { color: theme.textSecondary }]}>Just ₹49/month</Text>
                    </GlassCard>
                </TouchableOpacity>
            </View>

            <TouchableOpacity 
                style={[styles.subscribeBtn, { backgroundColor: '#F59E0B' }]} 
                onPress={handlePurchase}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.subscribeText}>Upgrade Now</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRestore} style={styles.restoreBtn}>
                <Text style={[styles.restoreText, { color: theme.textSecondary }]}>Restore Purchases</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    closeBtn: {
        position: 'absolute',
        top: 60,
        right: 24,
        zIndex: 10,
    },
    header: {
        alignItems: 'center',
        marginTop: 80,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 16,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 24,
    },
    featuresList: {
        paddingHorizontal: 24,
        marginTop: 40,
        gap: 24,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    featureText: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    featureDesc: {
        fontSize: 14,
        lineHeight: 20,
    },
    plansContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        marginTop: 40,
        gap: 16,
    },
    planCard: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        position: 'relative',
    },
    saveBadge: {
        position: 'absolute',
        top: -12,
        backgroundColor: '#10B981',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    saveText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    planTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    planPrice: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    planDuration: {
        fontSize: 14,
        fontWeight: 'normal',
    },
    planSub: {
        fontSize: 12,
        marginTop: 4,
    },
    subscribeBtn: {
        marginHorizontal: 24,
        marginTop: 32,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#F59E0B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    subscribeText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    restoreBtn: {
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 40,
    },
    restoreText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
