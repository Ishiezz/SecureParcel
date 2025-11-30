import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const GuardDashboard = () => {
    const { logout, packages, collectPackage } = useAuth();
    const [otpInput, setOtpInput] = useState('');

    const activePackages = packages.filter(p => p.status === 'stored');

    const handleVerify = () => {
        const pkg = activePackages.find(p => p.otp === otpInput);

        if (pkg) {
            Alert.alert(
                'OTP Verified',
                `Package for: ${pkg.studentName}\nSlot: ${pkg.slot}\n\nProceed with Biometric Verification?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Verify Biometrics',
                        onPress: () => {
                            Alert.alert('Biometric Verified', 'Identity Confirmed. Hand over package.', [
                                {
                                    text: 'Complete Handover',
                                    onPress: () => {
                                        collectPackage(pkg.id);
                                        setOtpInput('');
                                        Alert.alert('Success', 'Package marked as collected. Slot is now free.');
                                    }
                                }
                            ]);
                        }
                    }
                ]
            );
        } else {
            Alert.alert('Invalid OTP', 'No active package found with this OTP.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Security Guard</Text>
                <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.verificationSection}>
                <Text style={styles.sectionTitle}>Verify Collection</Text>
                <Text style={styles.subtitle}>Enter Student's OTP</Text>

                <TextInput
                    style={styles.otpInput}
                    placeholder="XXXX"
                    keyboardType="numeric"
                    maxLength={4}
                    value={otpInput}
                    onChangeText={setOtpInput}
                />

                <TouchableOpacity style={styles.verifyBtn} onPress={handleVerify}>
                    <Text style={styles.verifyText}>Verify OTP</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.listSection}>
                <Text style={styles.listTitle}>Active Compartments ({activePackages.length})</Text>
                <FlatList
                    data={activePackages}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <View>
                                <Text style={styles.slotText}>Slot {item.slot}</Text>
                                <Text style={styles.studentText}>{item.studentName}</Text>
                            </View>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>Occupied</Text>
                            </View>
                        </View>
                    )}
                />
            </View>
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
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    logoutBtn: {
        padding: 8,
    },
    logoutText: {
        color: '#e74c3c',
        fontWeight: '600',
    },
    verificationSection: {
        padding: 30,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 5,
    },
    subtitle: {
        color: '#7f8c8d',
        marginBottom: 20,
    },
    otpInput: {
        fontSize: 32,
        letterSpacing: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#27ae60',
        width: '80%',
        textAlign: 'center',
        marginBottom: 30,
        padding: 10,
    },
    verifyBtn: {
        backgroundColor: '#27ae60',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        shadowColor: '#27ae60',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    verifyText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    listSection: {
        flex: 1,
        padding: 20,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#34495e',
        marginBottom: 15,
    },
    listItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    slotText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    studentText: {
        color: '#7f8c8d',
        fontSize: 14,
    },
    statusBadge: {
        backgroundColor: '#ffeaa7',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    statusText: {
        color: '#d35400',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default GuardDashboard;
