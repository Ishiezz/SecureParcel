import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Filter, CheckCircle2 } from 'lucide-react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { AnimatedCard } from '../../components/ui/AnimatedCard';
import { format } from 'date-fns';

export const DeliveryHistoryScreen = () => {
    const { theme } = useThemeStore();
    const navigation = useNavigation();
    
    // Mock data for delivery history
    const [history] = useState([
        { id: '1', packageId: 'PKG-DHL-7729', studentName: 'Ayush Kumar Singh', slot: 'A-01 (M)', date: new Date(), status: 'stored' },
        { id: '2', packageId: 'PKG-BLUE-2831', studentName: 'Rohan Verma', slot: 'B-03 (XL)', date: new Date(Date.now() - 14400000), status: 'verified' },
        { id: '3', packageId: 'PKG-AMZN-4091', studentName: 'Priya Sharma', slot: 'B-04 (S)', date: new Date(Date.now() - 28800000), status: 'stored' },
        { id: '4', packageId: 'PKG-DTDC-8812', studentName: 'Vikram Malhotra', slot: 'C-01 (L)', date: new Date(Date.now() - 86400000), status: 'stored' },
        { id: '5', packageId: 'PKG-BLUE-4920', studentName: 'Neha Deshmukh', slot: 'A-02 (XL)', date: new Date(Date.now() - 172800000), status: 'collected' },
        { id: '6', packageId: 'PKG-FLIP-3012', studentName: 'Karan Johar', slot: 'C-03 (M)', date: new Date(Date.now() - 259200000), status: 'expired' },
        { id: '7', packageId: 'PKG-POST-1930', studentName: 'Ananya Roy', slot: 'B-01 (S)', date: new Date(Date.now() - 345600000), status: 'stored' },
        { id: '8', packageId: 'PKG-FEDX-9081', studentName: 'Sameer Sheikh', slot: 'A-03 (L)', date: new Date(Date.now() - 432000000), status: 'collected' },
        { id: '9', packageId: 'PKG-AMZN-7091', studentName: 'Deepika Padukone', slot: 'C-02 (M)', date: new Date(Date.now() - 518400000), status: 'collected' },
        { id: '10', packageId: 'PKG-DHL-2831', studentName: 'Ranveer Singh', slot: 'B-02 (L)', date: new Date(Date.now() - 604800000), status: 'collected' },
        { id: '11', packageId: 'PKG-AMZN-9912', studentName: 'Aditya Sen', slot: 'C-04 (M)', date: new Date(Date.now() - 691200000), status: 'stored' },
        { id: '12', packageId: 'PKG-UPS-8821', studentName: 'Kabir Khan', slot: 'B-05 (S)', date: new Date(Date.now() - 777600000), status: 'collected' },
        { id: '13', packageId: 'PKG-DHL-1029', studentName: 'Shreya Ghoshal', slot: 'A-04 (XL)', date: new Date(Date.now() - 864000000), status: 'pending' },
        { id: '14', packageId: 'PKG-FEDX-3421', studentName: 'Rahul Dravid', slot: 'C-05 (L)', date: new Date(Date.now() - 950400000), status: 'expired' },
        { id: '15', packageId: 'PKG-AMZN-1122', studentName: 'Mahendra Singh Dhoni', slot: 'B-06 (S)', date: new Date(Date.now() - 1036800000), status: 'stored' }
    ]);

    const renderItem = ({ item }: any) => {
        let badgeColor = '#3B82F6'; // Default stored/pending Blue
        if (item.status === 'collected') badgeColor = '#10B981'; // Green
        else if (item.status === 'expired') badgeColor = '#EF4444'; // Red
        else if (item.status === 'verified') badgeColor = '#F59E0B'; // Amber

        return (
            <AnimatedCard style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.packageId, { color: theme.text }]}>{item.packageId}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: badgeColor + '20' }]}>
                        <Text style={[styles.statusText, { color: badgeColor }]}>
                            {item.status.toUpperCase()}
                        </Text>
                    </View>
                </View>
            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Student</Text>
                    <Text style={[styles.infoValue, { color: theme.text }]}>{item.studentName}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Locker</Text>
                    <Text style={[styles.infoValue, { color: theme.text }]}>{item.slot}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Date</Text>
                    <Text style={[styles.infoValue, { color: theme.text }]}>{format(item.date, 'MMM dd, yyyy HH:mm')}</Text>
                </View>
            </View>
        </AnimatedCard>
    );
};

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.card }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Delivery History</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Filter size={20} color={theme.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.statsContainer}>
                <View style={[styles.statBox, { backgroundColor: theme.card }]}>
                    <CheckCircle2 size={24} color="#10B981" />
                    <Text style={[styles.statValue, { color: theme.text }]}>{history.length}</Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Deliveries</Text>
                </View>
            </View>

            <FlatList
                data={history}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 10,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
    },
    filterButton: {
        padding: 8,
    },
    statsContainer: {
        padding: 20,
    },
    statBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 16,
        marginRight: 8,
    },
    statLabel: {
        fontSize: 14,
    },
    listContainer: {
        padding: 20,
        paddingTop: 0,
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
    packageId: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    cardBody: {
        gap: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 14,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '500',
    },
});
