import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const DeliveryDashboard = ({ navigation }) => {
    const { user, logout, addPackage, verifyStudent } = useAuth();
    const { colors: themeColors } = useTheme();

    const dynamicStyles = {
        header: { backgroundColor: themeColors.surface, borderBottomColor: themeColors.border },
        input: { backgroundColor: themeColors.inputBackground, color: themeColors.textPrimary, borderColor: themeColors.border },
        button: { backgroundColor: themeColors.primary },
        buttonText: { color: themeColors.white },
        card: { backgroundColor: themeColors.surface, borderColor: themeColors.border },
        label: { color: themeColors.textSecondary },
        value: { color: themeColors.textPrimary },
        placeholder: themeColors.textSecondary,
    };
    const [studentName, setStudentName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [courier, setCourier] = useState('');
    const [slot, setSlot] = useState('');

    const handleDeposit = () => {
        if (!studentName || !studentId || !courier || !slot) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        if (!verifyStudent(studentName, studentId)) {
            Alert.alert('Error', 'Student not found. Please check the Name and ID.');
            return;
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const newPackage = {
            studentName,
            studentId,
            courier,
            slot,
            otp,
            date: new Date().toLocaleDateString(),
        };

        addPackage(newPackage);
        Alert.alert('Success', `Package Deposited! \nOTP Generated: ${otp}`);


        setStudentName('');
        setStudentId('');
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
                <View style={styles.profileCard}>
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'D'}</Text>
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{user?.name || 'Delivery Partner'}</Text>
                            <Text style={styles.profileId}>ID: {user?.id || 'D-XXXX'}</Text>
                        </View>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>128</Text>
                            <Text style={styles.statLabel}>Deliveries</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>4.9</Text>
                            <Text style={styles.statLabel}>Rating</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>12</Text>
                            <Text style={styles.statLabel}>Pending</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Deposit New Package</Text>

                <View style={styles.form}>
                    <Text style={styles.label}>Student Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter the student name"
                        placeholderTextColor={themeColors.textSecondary}
                        value={studentName}
                        onChangeText={setStudentName}
                    />

                    <Text style={styles.label}>Student ID</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter the student id"
                        placeholderTextColor={themeColors.textSecondary}
                        value={studentId}
                        onChangeText={setStudentId}
                    />

                    <Text style={styles.label}>Courier Service</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Amazon, Flipkart"
                        placeholderTextColor={themeColors.textSecondary}
                        value={courier}
                        onChangeText={setCourier}
                    />

                    <Text style={styles.label}>Assign Compartment Slot</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. A-12"
                        placeholderTextColor={themeColors.textSecondary}
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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    logoutBtn: {
        padding: 8,
    },
    logoutText: {
        color: '#B0B0B0',
        fontWeight: '600',
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#FFFFFF',
    },
    form: {
        backgroundColor: '#1E1E1E',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#333333',
    },
    label: {
        fontSize: 16,
        color: '#B0B0B0',
        marginBottom: 8,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#333333',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#2C2C2C',
        color: '#FFFFFF',
    },
    submitBtn: {
        backgroundColor: '#D4AF37',
        padding: 16,
        borderRadius: 8,
        marginTop: 30,
        alignItems: 'center',
    },
    submitText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    profileCard: {
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 20,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#333333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#D4AF37',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    profileId: {
        fontSize: 14,
        color: '#B0B0B0',
        marginBottom: 2,
    },

    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#333333',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#D4AF37',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#B0B0B0',
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#333333',
    },
});

export default DeliveryDashboard;
