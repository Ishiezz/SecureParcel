import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const PackageHistoryScreen = ({ navigation, route }) => {
    const { packages } = useAuth();
    const filter = route.params?.filter;

    const displayPackages = (() => {
        switch (filter) {
            case 'all':
                return packages;
            case 'waiting':
                return packages.filter(p => p.status === 'stored');
            case 'collected':
                return packages.filter(p => p.status === 'collected');
            default:
                return packages.filter(p => p.status === 'collected');
        }
    })();

    const renderItem = ({ item }) => {
        const isCollected = item.status === 'collected';
        const statusColor = isCollected ? '#1abc9c' : '#9b59b6';

        return (
            <View style={[styles.card, { borderColor: statusColor + '40' }]}>
                <View style={styles.cardHeader}>
                    <View style={styles.headerLeft}>
                        <MaterialCommunityIcons
                            name={isCollected ? "package-variant-closed" : "package-variant"}
                            size={24}
                            color={statusColor}
                        />
                        <Text style={[styles.packageId, { color: statusColor }]}>ID: {item.id}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                        <Text style={[styles.statusText, { color: statusColor }]}>
                            {isCollected ? 'Collected' : 'Waiting'}
                        </Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Courier:</Text>
                        <Text style={styles.value}>{item.courier}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Arrived:</Text>
                        <Text style={styles.value}>{item.date || new Date(Number(item.id)).toLocaleDateString()}</Text>
                    </View>
                    {isCollected ? (
                        <>
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Collected:</Text>
                                <Text style={styles.value}>
                                    {item.collectedAt
                                        ? new Date(item.collectedAt).toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true
                                        })
                                        : 'N/A'}
                                </Text>
                            </View>
                            <View style={styles.guardInfo}>
                                <Text style={styles.guardLabel}>Handed over by:</Text>
                                <Text style={[styles.guardValue, { color: statusColor }]}>{item.guardName} ({item.guardId})</Text>
                            </View>
                        </>
                    ) : (
                        <View style={styles.detailRow}>
                            <Text style={styles.label}>OTP:</Text>
                            <Text style={[styles.value, { color: statusColor, fontSize: 16 }]}>{item.otp}</Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Package History</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={displayPackages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name="history" size={60} color="#B0B0B0" />
                        <Text style={styles.emptyText}>No history yet.</Text>
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
    list: {
        padding: 20,
    },
    card: {
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        marginBottom: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E1BEE7',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    packageId: {
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
        fontSize: 12,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#333333',
        marginBottom: 12,
    },
    detailsContainer: {
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        color: '#B0B0B0',
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    guardInfo: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#333333',
    },
    guardLabel: {
        fontSize: 12,
        color: '#B0B0B0',
        marginBottom: 2,
    },
    guardValue: {
        fontSize: 14,
        fontWeight: 'bold',
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
    },
});

export default PackageHistoryScreen;
