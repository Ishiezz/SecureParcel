import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeStore } from '../../store/useThemeStore';
import { usePackageStore } from '../../store/usePackageStore';
import { SearchBar } from '../../components/ui/SearchBar';
import { AnimatedCard } from '../../components/ui/AnimatedCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { Package, Check, X, Filter } from 'lucide-react-native';
import { format } from 'date-fns';

export default function PackageHistoryScreen() {
    const { theme } = useThemeStore();
    const { packages } = usePackageStore();
    const navigation = useNavigation<any>();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'collected' | 'expired'>('all');

    const historyPackages = packages.filter(p => p.status === 'collected' || p.status === 'expired');

    const filteredPackages = historyPackages.filter(p => {
        const matchesSearch = p.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.courier.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' || p.status === filter;
        return matchesSearch && matchesFilter;
    });

    const renderItem = ({ item }: { item: any }) => (
        <AnimatedCard 
            style={styles.card}
            onPress={() => navigation.navigate('LiveTracking', { packageId: item.id })}
        >
            <View style={styles.cardHeader}>
                <View style={styles.courierInfo}>
                    <Package size={20} color={theme.textSecondary} />
                    <Text style={[styles.courierText, { color: theme.text }]}>{item.courier}</Text>
                </View>
                <View style={[
                    styles.statusBadge, 
                    { backgroundColor: item.status === 'collected' ? '#10B98120' : '#EF444420' }
                ]}>
                    <Text style={[
                        styles.statusText, 
                        { color: item.status === 'collected' ? '#10B981' : '#EF4444' }
                    ]}>
                        {item.status.toUpperCase()}
                    </Text>
                </View>
            </View>

            <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Tracking ID</Text>
                    <Text style={[styles.detailValue, { color: theme.text }]}>{item.id}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Date</Text>
                    <Text style={[styles.detailValue, { color: theme.text }]}>
                        {format(new Date(item.updatedAt || item.createdAt), 'MMM dd, yyyy')}
                    </Text>
                </View>
            </View>
        </AnimatedCard>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.card }]}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>History</Text>
                <View style={styles.searchContainer}>
                    <SearchBar 
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search by ID or Courier..."
                    />
                </View>
                <View style={styles.filterTabs}>
                    {(['all', 'collected', 'expired'] as const).map(f => (
                        <TouchableOpacity
                            key={f}
                            style={[
                                styles.filterTab,
                                filter === f && { backgroundColor: theme.primary }
                            ]}
                            onPress={() => setFilter(f)}
                        >
                            <Text style={[
                                styles.filterTabText,
                                { color: filter === f ? (theme.mode === 'dark' ? '#000000' : '#FFFFFF') : theme.textSecondary }
                            ]}>
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <FlatList
                data={filteredPackages}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <EmptyState 
                        type={searchQuery ? 'search' : 'history'} 
                        title={searchQuery ? 'No Results' : 'No History'}
                        description={searchQuery ? 'Try a different search term.' : 'Your past deliveries will appear here.'}
                    />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    searchContainer: {
        marginVertical: 12,
    },
    filterTabs: {
        flexDirection: 'row',
        gap: 8,
    },
    filterTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    filterTabText: {
        fontSize: 13,
        fontWeight: '600',
    },
    listContainer: {
        padding: 24,
        paddingBottom: 100, // Tab bar padding
        flexGrow: 1,
    },
    card: {
        marginBottom: 16,
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
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
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailItem: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
    },
});
