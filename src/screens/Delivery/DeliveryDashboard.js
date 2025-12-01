import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';

const DeliveryDashboard = ({ navigation }) => {
    const { user, logout, addPackage } = useAuth();
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
                            <Text style={styles.profileEmail}>{user?.email || 'email@secureparcel.com'}</Text>
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
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    logoutBtn: {
        padding: 8,
    },
    logoutText: {
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: COLORS.textPrimary,
    },
    form: {
        backgroundColor: COLORS.surface,
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    label: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 8,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: COLORS.inputBackground,
        color: COLORS.textPrimary,
    },
    submitBtn: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 8,
        marginTop: 30,
        alignItems: 'center',
    },
    submitText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    profileCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: COLORS.border,
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
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarText: {
        color: COLORS.white,
        fontSize: 24,
        fontWeight: 'bold',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    profileId: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 2,
    },
    profileEmail: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: COLORS.border,
    },
});

export default DeliveryDashboard;
