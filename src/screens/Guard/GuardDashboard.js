import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Modal, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const GuardDashboard = ({ navigation }) => {
    const { user, logout, packages, collectPackage } = useAuth();
    const { colors: themeColors } = useTheme();

    const dynamicStyles = {
        header: { backgroundColor: themeColors.surface, borderBottomColor: themeColors.border },
        card: { backgroundColor: themeColors.surface, borderColor: themeColors.border },
        selectedCard: { borderColor: themeColors.primary, backgroundColor: themeColors.primary + '10' },
        iconContainer: { backgroundColor: themeColors.background },
        button: { backgroundColor: themeColors.primary },
        buttonText: { color: themeColors.white },
        input: { backgroundColor: themeColors.inputBackground, color: themeColors.textPrimary, borderColor: themeColors.border },
        placeholder: themeColors.textSecondary,
        modalContent: { backgroundColor: themeColors.surface },
        textPrimary: { color: themeColors.textPrimary },
        textSecondary: { color: themeColors.textSecondary },
        primaryColor: themeColors.primary,
    };
    const [otpInput, setOtpInput] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [verifiedPackage, setVerifiedPackage] = useState(null);
    const [otp, setOtp] = useState(['', '', '', '']);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const inputRefs = React.useRef([]);

    const activePackages = packages.filter(p => p.status === 'stored');

    const handleOtpChange = (value, index) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setOtpInput(newOtp.join(''));

        if (value && index < 3) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerify = () => {
        const otpString = otp.join('');

        let pkg;
        if (selectedId) {
            pkg = activePackages.find(p => p.id === selectedId && p.otp === otpString);
        } else {
            pkg = activePackages.find(p => p.otp === otpString);
        }

        if (pkg) {
            setVerifiedPackage(pkg);
            setShowModal(true);
        } else {
            Alert.alert('Error', 'Invalid OTP. Please check and try again.');
        }
    };

    const startBiometricScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            setShowModal(false);
            Alert.alert('Identity Verified', 'Biometric match confirmed. Hand over package.', [
                {
                    text: 'Complete Handover',
                    onPress: () => {
                        collectPackage(verifiedPackage.id);
                        setOtp(['', '', '', '']);
                        setSelectedId(null);
                        setVerifiedPackage(null);
                    }
                }
            ]);
        }, 2000);
    };



    const handleSelectPackage = (pkg) => {
        if (selectedId === pkg.id) {
            setOtp(['', '', '', '']);
        } else {
            setSelectedId(pkg.id);
            setSelectedPackage(pkg);
            setOtp(['', '', '', '']);
        }
    };

    const renderPackage = ({ item }) => {
        const isSelected = selectedPackage?.id === item.id;
        return (
            <TouchableOpacity
                style={[styles.card, dynamicStyles.card, isSelected && dynamicStyles.selectedCard]}
                onPress={() => setSelectedPackage(item)}
            >
                <View style={styles.cardHeader}>
                    <View style={[styles.iconContainer, dynamicStyles.iconContainer]}>
                        <MaterialCommunityIcons name="package-variant" size={24} color={themeColors.primary} />
                    </View>
                    <View style={styles.packageInfo}>
                        <Text style={[styles.courier, dynamicStyles.textPrimary]}>{item.courier}</Text>
                        <Text style={[styles.slot, dynamicStyles.textSecondary]}>Slot: {item.slot}</Text>
                    </View>
                    <View style={styles.studentInfo}>
                        <Text style={[styles.studentId, dynamicStyles.textPrimary]}>{item.studentId}</Text>
                        <Text style={[styles.otpDisplay, { color: themeColors.primary }]}>OTP: {item.otp}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header, dynamicStyles.header]}>
                <View>
                    <Text style={[styles.greeting, dynamicStyles.textSecondary]}>Shift Active</Text>
                    <Text style={[styles.username, dynamicStyles.textPrimary]}>{user?.name || 'Security Guard'}</Text>
                </View>
                <View style={styles.headerRight}>
                    <View style={[styles.statusBadge, { backgroundColor: themeColors.success + '20' }]}>
                        <View style={[styles.statusDot, { backgroundColor: themeColors.success }]} />
                        <Text style={[styles.statusText, { color: themeColors.success }]}>Online</Text>
                    </View>
                    <TouchableOpacity onPress={logout} style={[styles.logoutBtn, { backgroundColor: themeColors.surface }]}>
                        <MaterialCommunityIcons name="logout" size={20} color={themeColors.error} />
                    </TouchableOpacity>
                </View>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <View style={styles.verifySection}>
                    <View style={styles.verifyHeader}>
                        <MaterialCommunityIcons name="shield-check-outline" size={30} color={themeColors.primary} />
                        <Text style={styles.sectionTitle}>
                            {selectedPackage ? 'Verify Selected Order' : 'Verify Collection'}
                        </Text>
                    </View>

                    <Text style={styles.label}>
                        {selectedPackage
                            ? `Enter OTP for ${selectedPackage?.studentName}`
                            : 'Enter Student OTP'}
                    </Text>
                    <View style={styles.otpContainer}>
                        <TextInput
                            style={[styles.otpInput, dynamicStyles.input]}
                            placeholder="Enter 4-digit OTP"
                            placeholderTextColor={dynamicStyles.placeholder}
                            keyboardType="numeric"
                            maxLength={4}
                            value={otpInput}
                            onChangeText={setOtpInput}
                        />
                    </View>

                    <TouchableOpacity style={styles.verifyBtn} onPress={handleVerify}>
                        <Text style={styles.verifyBtnText}>Verify OTP</Text>
                        <MaterialCommunityIcons name="arrow-right" size={20} color={themeColors.white} />
                    </TouchableOpacity>
                </View>

                <View style={styles.listContainer}>
                    <View style={styles.listHeader}>
                        <Text style={styles.listTitle}>Active Packages</Text>
                        <View style={styles.countBadge}>
                            <Text style={styles.countText}>{activePackages.length}</Text>
                        </View>
                    </View>

                    <FlatList
                        data={activePackages}
                        renderItem={renderPackage}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyText}>No active packages to verify.</Text>
                            </View>
                        }
                    />
                </View>
            </KeyboardAvoidingView>

            <Modal visible={showModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <MaterialCommunityIcons name="account-check-outline" size={40} color={themeColors.primary} />
                        </View>
                        <Text style={styles.modalTitle}>Identity Verification</Text>
                        <Text style={styles.modalSubtitle}>Verify identity of <Text style={{ fontWeight: 'bold', color: themeColors.textPrimary }}>{verifiedPackage?.studentName}</Text></Text>

                        <View style={styles.scanContainer}>
                            {isScanning ? (
                                <>
                                    <ActivityIndicator size="large" color={themeColors.primary} />
                                    <Text style={styles.scanText}>Scanning Biometrics...</Text>
                                </>
                            ) : (
                                <TouchableOpacity onPress={startBiometricScan} style={styles.fingerprintBtn}>
                                    <MaterialCommunityIcons name="fingerprint" size={60} color={themeColors.primary} />
                                    <Text style={styles.tapText}>Tap to Scan</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    logoutBtn: {
        padding: 8,
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        borderRadius: 8,
    },
    verifySection: {
        padding: 20,
        backgroundColor: COLORS.surface,
        margin: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    verifyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginLeft: 10,
    },
    label: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
        marginTop: 10,
    },
    otpBox: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        backgroundColor: COLORS.inputBackground,
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        textAlign: 'center',
        elevation: 2,
    },
    otpBoxFilled: {
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(39, 174, 96, 0.1)',
    },
    verifyBtn: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    verifyBtnText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 8,
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    countBadge: {
        backgroundColor: COLORS.surface,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    countText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    listContent: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: COLORS.surface,
        padding: 15,
        borderRadius: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(39, 174, 96, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    cardContent: {
        flex: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    slot: {
        fontWeight: 'bold',
        fontSize: 16,
        color: COLORS.textPrimary,
    },
    statusBadge: {
        backgroundColor: 'rgba(39, 174, 96, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    statusText: {
        color: COLORS.primary,
        fontSize: 10,
        fontWeight: 'bold',
    },
    studentName: {
        color: COLORS.textPrimary,
        fontSize: 14,
        marginBottom: 2,
    },
    courier: {
        color: COLORS.textSecondary,
        fontSize: 12,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 30,
    },
    emptyText: {
        color: COLORS.textSecondary,
        fontStyle: 'italic',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: COLORS.surface,
        width: '85%',
        padding: 30,
        borderRadius: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    modalHeader: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: 'rgba(39, 174, 96, 0.1)',
        borderRadius: 40,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 10,
    },
    modalSubtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 30,
        textAlign: 'center',
    },
    scanContainer: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
    },
    fingerprintBtn: {
        alignItems: 'center',
    },
    tapText: {
        color: COLORS.textSecondary,
        marginTop: 10,
        fontSize: 14,
    },
    scanText: {
        marginTop: 15,
        color: COLORS.primary,
        fontWeight: '500',
    },
    cancelText: {
        color: COLORS.textSecondary,
        fontSize: 16,
    },
    cardSelected: {
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(39, 174, 96, 0.05)',
        borderWidth: 2,
    },
    cardIconSelected: {
        backgroundColor: COLORS.primary,
    },
    statusBadgeSelected: {
        backgroundColor: COLORS.primary,
    },
    statusTextSelected: {
        color: COLORS.white,
    },
});

export default GuardDashboard;
