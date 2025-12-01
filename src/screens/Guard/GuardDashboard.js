import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Modal, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const GuardDashboard = ({ navigation }) => {
    const { user, logout, packages, collectPackage } = useAuth();
    const { colors: themeColors } = useTheme();

    const dynamicStyles = {
        header: {
            backgroundColor: themeColors.surface,
            borderBottomColor: themeColors.border,
            shadowColor: themeColors.shadow || '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        card: { backgroundColor: themeColors.surface, borderColor: themeColors.border },
        selectedCard: { borderColor: themeColors.primary, backgroundColor: themeColors.primary + '15', borderWidth: 2 },
        iconContainer: { backgroundColor: themeColors.background },
        button: { backgroundColor: themeColors.primary },
        buttonText: { color: themeColors.white },
        input: { backgroundColor: themeColors.inputBackground, color: themeColors.textPrimary, borderColor: themeColors.border },
        placeholder: themeColors.textSecondary,
        modalContent: { backgroundColor: themeColors.surface, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
        textPrimary: { color: themeColors.textPrimary },
        textSecondary: { color: themeColors.textSecondary },
        primaryColor: themeColors.primary,
        otpSection: { backgroundColor: themeColors.surface, borderColor: themeColors.border },
    };

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
                        collectPackage(verifiedPackage.id, user?.name, user?.id);
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
                activeOpacity={0.7}
            >
                <View style={[styles.iconContainer, dynamicStyles.iconContainer, isSelected && styles.cardIconSelected]}>
                    <MaterialCommunityIcons
                        name="package-variant"
                        size={24}
                        color={isSelected ? '#FFFFFF' : themeColors.primary}
                    />
                </View>

                <View style={styles.cardContent}>
                    <Text style={[styles.studentName, dynamicStyles.textPrimary]}>
                        {item.studentName} <Text style={{ fontWeight: 'normal', fontSize: 14, color: themeColors.textSecondary }}>({item.studentId})</Text>
                    </Text>
                    <Text style={[styles.subtext, dynamicStyles.textSecondary]}>
                        {item.courier}
                    </Text>
                </View>

                <View style={[styles.slotBadge, { backgroundColor: themeColors.primary + '15' }]}>
                    <Text style={[styles.slotText, { color: themeColors.primary }]}>{item.slot}</Text>
                </View>

                {isSelected && (
                    <View style={styles.selectedIndicator}>
                        <MaterialCommunityIcons name="check-circle" size={20} color={themeColors.primary} />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header, dynamicStyles.header]}>
                <View>

                    <Text style={[styles.username, dynamicStyles.textPrimary]}>Security Guard</Text>
                </View>
                <View style={styles.headerRight}>

                    <TouchableOpacity onPress={logout} style={[styles.logoutBtn, { backgroundColor: themeColors.surface }]}>
                        <MaterialCommunityIcons name="logout" size={20} color={themeColors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <View style={[styles.verifySection, dynamicStyles.otpSection]}>
                    <View style={styles.verifyHeader}>
                        <MaterialCommunityIcons name="shield-check-outline" size={30} color={themeColors.success} />
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
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={ref => inputRefs.current[index] = ref}
                                style={[
                                    styles.otpBox,
                                    dynamicStyles.input,
                                    digit ? styles.otpBoxFilled : null,
                                    digit ? { borderColor: themeColors.primary, backgroundColor: themeColors.primary + '15' } : { borderColor: themeColors.border }
                                ]}
                                value={digit}
                                onChangeText={(value) => handleOtpChange(value, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="numeric"
                                maxLength={1}
                                selectTextOnFocus
                                textAlign="center"
                                placeholder=""
                                placeholderTextColor={dynamicStyles.placeholder}
                            />
                        ))}
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
                    <View style={[styles.modalContent, dynamicStyles.modalContent]}>
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
        backgroundColor: '#121212',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#1E1E1E',
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
        zIndex: 10,
    },
    welcomeText: {
        fontSize: 12,
        color: '#B0B0B0',
        marginBottom: 2,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    subtitle: {
        fontSize: 14,
        color: '#B0B0B0',
    },
    logoutBtn: {
        padding: 8,
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        borderRadius: 8,
    },
    verifySection: {
        padding: 24,
        backgroundColor: '#1E1E1E',
        margin: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#333333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    verifyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginLeft: 10,
    },
    label: {
        fontSize: 14,
        color: '#B0B0B0',
        marginBottom: 8,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
        marginTop: 10,
    },
    otpBox: {
        width: 65,
        height: 65,
        borderWidth: 1.5,
        borderColor: '#333333',
        borderRadius: 16,
        backgroundColor: '#2C2C2C',
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        elevation: 0,
    },
    otpBoxFilled: {
        borderColor: '#D4AF37',
        backgroundColor: 'rgba(39, 174, 96, 0.1)',
    },
    verifyBtn: {
        backgroundColor: '#D4AF37',
        padding: 18,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    verifyBtnText: {
        color: '#FFFFFF',
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
        color: '#FFFFFF',
    },
    countBadge: {
        backgroundColor: '#1E1E1E',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333333',
    },
    countText: {
        color: '#D4AF37',
        fontWeight: 'bold',
    },
    listContent: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#1E1E1E',
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#333333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: 'rgba(39, 174, 96, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
        marginLeft: 4,
    },
    subtext: {
        fontSize: 13,
        marginTop: 2,
    },
    slotBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginLeft: 8,
    },
    slotText: {
        fontSize: 12,
        fontWeight: 'bold',
    },



    studentName: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    selectedIndicator: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 30,
    },
    emptyText: {
        color: '#B0B0B0',
        fontStyle: 'italic',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#1E1E1E',
        width: '85%',
        padding: 30,
        borderRadius: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333333',
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
        color: '#FFFFFF',
        marginBottom: 10,
    },
    modalSubtitle: {
        fontSize: 16,
        color: '#B0B0B0',
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
        color: '#B0B0B0',
        marginTop: 10,
        fontSize: 14,
    },
    scanText: {
        marginTop: 15,
        color: '#D4AF37',
        fontWeight: '500',
    },
    cancelText: {
        color: '#B0B0B0',
        fontSize: 16,
    },
    cardSelected: {
        borderColor: '#D4AF37',
        backgroundColor: 'rgba(39, 174, 96, 0.05)',
        borderWidth: 2,
    },
    cardIconSelected: {
        backgroundColor: '#D4AF37',
    },
    statusBadgeSelected: {
        backgroundColor: '#D4AF37',
    },
    statusTextSelected: {
        color: '#FFFFFF',
    },
});

export default GuardDashboard;
