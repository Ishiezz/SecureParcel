import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Key, UserCheck, ShieldAlert, ShieldCheck } from 'lucide-react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { AnimatedCard } from '../../components/ui/AnimatedCard';
import { format } from 'date-fns';

export const ActivityLogScreen = () => {
    const { theme } = useThemeStore();
    const navigation = useNavigation();
    
    // Mock data for guard activity log — Expanded with rich real-world campus security handovers
    const [logs] = useState([
        { id: '1', action: 'verify', packageId: 'PKG-DHL-7729', studentName: 'Ayush Kumar Singh', timestamp: new Date(), success: true },
        { id: '2', action: 'biometric', packageId: 'PKG-BLUE-2831', studentName: 'Rohan Verma', timestamp: new Date(Date.now() - 1800000), success: true, message: 'Guard Biometric Release Authorized' },
        { id: '3', action: 'verify', packageId: 'PKG-AMZN-4091', studentName: 'Priya Sharma', timestamp: new Date(Date.now() - 3600000), success: true },
        { id: '4', action: 'alert', message: 'Expired QR code presented', timestamp: new Date(Date.now() - 7200000), success: false, packageId: 'PKG-EXP-992' },
        { id: '5', action: 'override', message: 'Admin override PIN entry', timestamp: new Date(Date.now() - 14400000), success: true, studentName: 'Dr. S. K. Gupta (Warden)' },
        { id: '6', action: 'verify', packageId: 'PKG-POST-1930', studentName: 'Neha Deshmukh', timestamp: new Date(Date.now() - 28800000), success: true },
        { id: '7', action: 'alert', message: 'Incorrect OTP entry (3 failed attempts)', timestamp: new Date(Date.now() - 43200000), success: false, studentName: 'Karan Malhotra' },
        { id: '8', action: 'release', message: 'Manual locker door release (Slot XL2)', timestamp: new Date(Date.now() - 86400000), success: true },
        { id: '9', action: 'verify', packageId: 'PKG-FEDX-9081', studentName: 'Ananya Sen', timestamp: new Date(Date.now() - 172800000), success: true },
        { id: '10', action: 'alert', message: 'Locker C-02 left open longer than 60s', timestamp: new Date(Date.now() - 259200000), success: false },
        { id: '11', action: 'verify', packageId: 'PKG-AMZN-9912', studentName: 'Aditya Sen', timestamp: new Date(Date.now() - 302400000), success: true },
        { id: '12', action: 'override', message: 'Locker A-03 Door Sensor Diagnostic Re-calibrated', timestamp: new Date(Date.now() - 345600000), success: true, studentName: 'System Admin' },
        { id: '13', action: 'alert', message: 'Locker Block B Connection Loss Alert', timestamp: new Date(Date.now() - 432000000), success: false },
        { id: '14', action: 'release', message: 'Manual locker door release (Slot S2)', timestamp: new Date(Date.now() - 518400000), success: true, studentName: 'Officer R. K. Nair' },
        { id: '15', action: 'biometric', packageId: 'PKG-DHL-1029', studentName: 'Shreya Ghoshal', timestamp: new Date(Date.now() - 604800000), success: true, message: 'Guard Biometric Release Authorized' }
    ]);

    const renderItem = ({ item }: any) => {
        let Icon = ShieldAlert;
        let color = '#10B981'; // Default green

        if (!item.success) {
            color = '#EF4444'; // Red for alerts
            Icon = ShieldAlert;
        } else if (item.action === 'verify' || item.action === 'biometric') {
            Icon = UserCheck;
        } else if (item.action === 'override' || item.action === 'release') {
            Icon = ShieldCheck;
            color = item.action === 'override' ? '#F59E0B' : '#8B5CF6'; // Amber for override, Purple for release
        }

        return (
            <AnimatedCard style={styles.card}>
                <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                    <Icon size={24} color={color} />
                </View>
                <View style={styles.logContent}>
                    <Text style={[styles.logTitle, { color: theme.text }]}>
                        {item.action === 'verify' 
                            ? `Verified ${item.packageId}` 
                            : (item.action === 'biometric' ? `Biometric scan: ${item.packageId}` : item.message)}
                    </Text>
                    {item.studentName && (
                        <Text style={[styles.logSubtitle, { color: theme.textSecondary }]}>
                            {item.studentName}
                        </Text>
                    )}
                    <Text style={[styles.timestamp, { color: theme.textSecondary }]}>
                        {format(item.timestamp, 'HH:mm - MMM dd')}
                    </Text>
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
                <Text style={[styles.headerTitle, { color: theme.text }]}>Activity Log</Text>
            </View>

            <FlatList
                data={logs}
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
    listContainer: {
        padding: 20,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        padding: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    logContent: {
        flex: 1,
    },
    logTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    logSubtitle: {
        fontSize: 14,
        marginBottom: 4,
    },
    timestamp: {
        fontSize: 12,
    },
});
