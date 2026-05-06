import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { GlassCard } from '../../components/ui/GlassCard';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';
import { TrendingUp, Package, Clock, ShieldCheck } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export const AnalyticsDashboardScreen = () => {
    const { theme } = useThemeStore();
    const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');

    // Mock data for analytics (In real app, fetch from backend/Mixpanel)
    const stats = {
        totalPackages: 142,
        avgPickupTime: 4.2, // hours
        secureDeliveries: 100, // percentage
        activeLockers: 85, // percentage
    };

    const weekData = [
        { label: 'M', value: 40 },
        { label: 'T', value: 60 },
        { label: 'W', value: 30 },
        { label: 'T', value: 80 },
        { label: 'F', value: 50 },
        { label: 'S', value: 90 },
        { label: 'S', value: 70 }
    ];

    const monthData = [
        { label: 'Wk 1', value: 75 },
        { label: 'Wk 2', value: 85 },
        { label: 'Wk 3', value: 60 },
        { label: 'Wk 4', value: 95 },
        { label: 'Wk 5', value: 80 }
    ];

    const isDark = theme.mode === 'dark';

    return (
        <ScrollView 
            style={[styles.container, { backgroundColor: theme.background }]}
            contentContainerStyle={styles.scrollContent}
        >
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Analytics</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Your delivery insights at a glance</Text>
            </View>

            <View style={styles.grid}>
                <GlassCard style={styles.card} intensity="light">
                    <View style={[styles.iconWrapper, { backgroundColor: '#3B82F620' }]}>
                        <Package size={24} color="#3B82F6" />
                    </View>
                    <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>Total Packages</Text>
                    <AnimatedCounter value={stats.totalPackages} style={[styles.cardValue, { color: theme.text }]} />
                </GlassCard>

                <GlassCard style={styles.card} intensity="light">
                    <View style={[styles.iconWrapper, { backgroundColor: '#F59E0B20' }]}>
                        <Clock size={24} color="#F59E0B" />
                    </View>
                    <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>Avg Pickup (Hrs)</Text>
                    <AnimatedCounter 
                        value={stats.avgPickupTime} 
                        formatter={(v) => v.toFixed(1)}
                        style={[styles.cardValue, { color: theme.text }]} 
                    />
                </GlassCard>

                <GlassCard style={styles.card} intensity="light">
                    <View style={[styles.iconWrapper, { backgroundColor: '#10B98120' }]}>
                        <ShieldCheck size={24} color="#10B981" />
                    </View>
                    <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>Secure Deliveries</Text>
                    <AnimatedCounter 
                        value={stats.secureDeliveries} 
                        formatter={(v) => `${v}%`}
                        style={[styles.cardValue, { color: theme.text }]} 
                    />
                </GlassCard>

                <GlassCard style={styles.card} intensity="light">
                    <View style={[styles.iconWrapper, { backgroundColor: '#8B5CF620' }]}>
                        <TrendingUp size={24} color="#8B5CF6" />
                    </View>
                    <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>Locker Usage</Text>
                    <AnimatedCounter 
                        value={stats.activeLockers} 
                        formatter={(v) => `${v}%`}
                        style={[styles.cardValue, { color: theme.text }]} 
                    />
                </GlassCard>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        {timeframe === 'week' ? 'Weekly Trend' : 'Monthly Trend'}
                    </Text>
                    <View style={[styles.toggleContainer, { backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
                        <TouchableOpacity
                            style={[styles.toggleBtn, timeframe === 'week' && { backgroundColor: theme.primary }]}
                            onPress={() => setTimeframe('week')}
                        >
                            <Text style={[
                                styles.toggleText,
                                { color: timeframe === 'week' ? (theme.mode === 'dark' ? '#000000' : '#FFFFFF') : theme.textSecondary }
                            ]}>
                                Week
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.toggleBtn, timeframe === 'month' && { backgroundColor: theme.primary }]}
                            onPress={() => setTimeframe('month')}
                        >
                            <Text style={[
                                styles.toggleText,
                                { color: timeframe === 'month' ? (theme.mode === 'dark' ? '#000000' : '#FFFFFF') : theme.textSecondary }
                            ]}>
                                Month
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <GlassCard intensity="heavy" style={styles.chartCard}>
                    <View style={styles.mockChart}>
                        {(timeframe === 'week' ? weekData : monthData).map((item, i) => (
                            <View key={i} style={styles.barContainer}>
                                <View style={[styles.bar, { height: `${item.value}%`, backgroundColor: theme.primary }]} />
                                <Text style={[styles.dayLabel, { color: theme.textSecondary }]}>
                                    {item.label}
                                </Text>
                            </View>
                        ))}
                    </View>
                </GlassCard>
            </View>

            {/* Courier Partner Distribution */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Courier Distribution</Text>
                <GlassCard intensity="light" style={styles.listCard}>
                    {[
                        { name: 'Amazon Prime', count: 52, percentage: 36, color: '#3B82F6' },
                        { name: 'DHL Express', count: 38, percentage: 27, color: '#F59E0B' },
                        { name: 'Blue Dart', count: 24, percentage: 17, color: '#10B981' },
                        { name: 'FedEx Express', count: 18, percentage: 13, color: '#8B5CF6' },
                        { name: 'DTDC & Others', count: 10, percentage: 7, color: '#EC4899' },
                    ].map((item, index) => (
                        <View key={index} style={styles.distributionRow}>
                            <View style={styles.rowHeader}>
                                <Text style={[styles.courierName, { color: theme.text }]}>{item.name}</Text>
                                <Text style={[styles.courierValue, { color: theme.textSecondary }]}>
                                    {item.count} ({item.percentage}%)
                                </Text>
                            </View>
                            <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
                                <View style={[styles.progressBar, { width: `${item.percentage}%`, backgroundColor: item.color }]} />
                            </View>
                        </View>
                    ))}
                </GlassCard>
            </View>

            {/* Zone Analysis */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Locker Zone Insights</Text>
                <GlassCard intensity="heavy" style={styles.insightsCard}>
                    <View style={styles.insightBox}>
                        <Text style={[styles.insightTitle, { color: theme.text }]}>Zone A (Student Union)</Text>
                        <Text style={[styles.insightDesc, { color: theme.textSecondary }]}>Highly active during lunch hours. 60% of Amazon deliveries drop off here.</Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: theme.border }]} />
                    <View style={styles.insightBox}>
                        <Text style={[styles.insightTitle, { color: theme.text }]}>Zone B (Main Gate Lobby)</Text>
                        <Text style={[styles.insightDesc, { color: theme.textSecondary }]}>Open 24/7. Holds the most secure packages (fingerprint release required).</Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: theme.border }]} />
                    <View style={styles.insightBox}>
                        <Text style={[styles.insightTitle, { color: theme.text }]}>Zone C (Library Wing)</Text>
                        <Text style={[styles.insightDesc, { color: theme.textSecondary }]}>Preferred for study books, academic tablets, and large document envelopes.</Text>
                    </View>
                </GlassCard>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 24,
        paddingTop: 60,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        marginTop: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 16,
    },
    card: {
        width: (width - 48) / 2, // 2 columns with 16 padding on sides + 16 gap
        padding: 16,
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 4,
    },
    cardValue: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    section: {
        padding: 24,
        marginTop: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    toggleContainer: {
        flexDirection: 'row',
        borderRadius: 20,
        padding: 2,
    },
    toggleBtn: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 18,
    },
    toggleText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    chartCard: {
        height: 250,
        padding: 24,
    },
    mockChart: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingBottom: 24,
    },
    barContainer: {
        alignItems: 'center',
        height: '100%',
        justifyContent: 'flex-end',
        width: 24,
    },
    bar: {
        width: 12,
        borderRadius: 6,
    },
    dayLabel: {
        position: 'absolute',
        bottom: -24,
        fontSize: 12,
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingBottom: 110, // Gives plenty of scroll room past bottom tabs!
    },
    listCard: {
        padding: 20,
    },
    distributionRow: {
        marginBottom: 16,
    },
    rowHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    courierName: {
        fontSize: 14,
        fontWeight: '600',
    },
    courierValue: {
        fontSize: 13,
    },
    progressTrack: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 3,
    },
    insightsCard: {
        padding: 20,
    },
    insightBox: {
        paddingVertical: 12,
    },
    insightTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    insightDesc: {
        fontSize: 13,
        lineHeight: 18,
    },
    divider: {
        height: 1,
        width: '100%',
    },
});
