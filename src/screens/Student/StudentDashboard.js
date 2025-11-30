import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const StudentDashboard = () => {
    const { user, logout, packages } = useAuth();

    const myPackages = packages.filter(p => p.status === 'stored');

    const renderPackage = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.courier}>{item.courier}</Text>
                <Text style={styles.date}>{item.date}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.label}>Compartment:</Text>
                <Text style={styles.value}>{item.slot}</Text>
            </View>

            <View style={styles.otpContainer}>
                <Text style={styles.otpLabel}>Collection OTP</Text>
                <Text style={styles.otpValue}>{item.otp}</Text>
            </View>

            <Text style={styles.instruction}>Show this OTP to the guard to collect.</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello, {user.name}</Text>
                    <Text style={styles.subtitle}>You have {myPackages.length} packages waiting</Text>
                </View>
                <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={myPackages}
                renderItem={renderPackage}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
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
        backgroundColor: '#f5f6fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        paddingBottom: 30,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    subtitle: {
        fontSize: 14,
        color: '#7f8c8d',
        marginTop: 4,
    },
    logoutBtn: {
        padding: 8,
    },
    logoutText: {
        color: '#e74c3c',
        fontWeight: '600',
    },
    list: {
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderLeftWidth: 5,
        borderLeftColor: '#3498db',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    courier: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    date: {
        color: '#95a5a6',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 10,
    },
    label: {
        fontSize: 16,
        color: '#7f8c8d',
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    otpContainer: {
        backgroundColor: '#ecf0f1',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    otpLabel: {
        fontSize: 12,
        color: '#7f8c8d',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    otpValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2c3e50',
        letterSpacing: 5,
    },
    instruction: {
        textAlign: 'center',
        color: '#95a5a6',
        fontSize: 12,
        fontStyle: 'italic',
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: '#bdc3c7',
        fontSize: 16,
    },
});

export default StudentDashboard;
