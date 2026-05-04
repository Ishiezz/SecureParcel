import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeStore } from '../../store/useThemeStore';
import { useLockerStore } from '../../store/useLockerStore';
import { VisualLockerMap } from '../../components/ui/VisualLockerMap';
import { AnimatedCard } from '../../components/ui/AnimatedCard';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';
import { Text } from 'react-native';

export const LockerMapScreen = () => {
    const { theme } = useThemeStore();
    const { lockers, isLoading, fetchLockers, subscribeToLockerUpdates } = useLockerStore();

    useEffect(() => {
        subscribeToLockerUpdates();
        return () => {
            // Store handles unsubscribe on unmount or re-subscribe
        };
    }, []);

    const availableCount = lockers.filter(l => l.status === 'available').length;
    const occupiedCount = lockers.filter(l => l.status === 'occupied').length;

    return (
        <ScrollView 
            style={[styles.container, { backgroundColor: theme.background }]}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchLockers} tintColor={theme.primary} />}
        >
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Campus Lockers</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Real-time availability map</Text>
            </View>

            <View style={styles.statsContainer}>
                <AnimatedCard style={styles.statCard}>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Available</Text>
                    <AnimatedCounter value={availableCount} style={[styles.statValue, { color: '#10B981' }]} />
                </AnimatedCard>
                <AnimatedCard style={styles.statCard} delay={100}>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Occupied</Text>
                    <AnimatedCounter value={occupiedCount} style={[styles.statValue, { color: '#EF4444' }]} />
                </AnimatedCard>
            </View>

            <View style={styles.mapContainer}>
                <VisualLockerMap lockers={lockers} />
            </View>

            <View style={styles.legend}>
                <LegendItem color="#10B981" label="Available" theme={theme} />
                <LegendItem color="#EF4444" label="Occupied" theme={theme} />
                <LegendItem color="#F59E0B" label="Reserved" theme={theme} />
                <LegendItem color="#6B7280" label="Maintenance" theme={theme} />
            </View>
        </ScrollView>
    );
};

const LegendItem = ({ color, label, theme }: any) => (
    <View style={styles.legendItem}>
        <View style={[styles.legendColor, { backgroundColor: color + '40', borderColor: color }]} />
        <Text style={[styles.legendLabel, { color: theme.textSecondary }]}>{label}</Text>
    </View>
);

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
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        gap: 16,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    mapContainer: {
        paddingHorizontal: 24,
    },
    legend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 24,
        gap: 16,
        marginTop: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendColor: {
        width: 16,
        height: 16,
        borderRadius: 4,
        borderWidth: 1,
        marginRight: 8,
    },
    legendLabel: {
        fontSize: 14,
    },
});
