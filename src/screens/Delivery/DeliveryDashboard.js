import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const DeliveryDashboard = () => {
    const { logout, addPackage } = useAuth();
    const [studentName, setStudentName] = useState('');
    const [courier, setCourier] = useState('');
    const [slot, setSlot] = useState('');

    const handleDeposit = () => {
        if (!studentName || !courier || !slot) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const newPackage = {
            studentName,
            courier,
            slot,
            otp,
            date: new Date().toLocaleDateString(),
        };

        addPackage(newPackage);
        Alert.alert('Success', `Package Deposited! \nOTP Generated: ${otp}`);


        setStudentName('');
        setCourier('');
        setSlot('');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Delivery Partner</Text>
                <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>Deposit New Package</Text>

                <View style={styles.form}>
                    <Text style={styles.label}>Student Name / ID</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Isha Singh (S123)"
                        value={studentName}
                        onChangeText={setStudentName}
                    />

                    <Text style={styles.label}>Courier Service</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Amazon, Flipkart"
                        value={courier}
                        onChangeText={setCourier}
                    />

                    <Text style={styles.label}>Assign Compartment Slot</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. A-12"
                        value={slot}
                        onChangeText={setSlot}
                    />

                    <TouchableOpacity style={styles.submitBtn} onPress={handleDeposit}>
                        <Text style={styles.submitText}>Generate OTP & Deposit</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#34495e',
    },
    form: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    label: {
        fontSize: 16,
        color: '#7f8c8d',
        marginBottom: 8,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#bdc3c7',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fafafa',
    },
    submitBtn: {
        backgroundColor: '#e67e22',
        padding: 16,
        borderRadius: 8,
        marginTop: 30,
        alignItems: 'center',
    },
    submitText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default DeliveryDashboard;
