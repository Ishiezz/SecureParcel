import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { ScanLine, LogOut, CheckCircle2, XCircle, ShieldCheck, FileText } from 'lucide-react-native';
import { GlassCard } from '../../components/ui/GlassCard';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function GuardDashboard() {
    const { theme } = useThemeStore();
    const { user, logout } = useAuthStore();
    const navigation = useNavigation<any>();
    
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [verifyStatus, setVerifyStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [studentData, setStudentData] = useState<any>(null);

    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, [permission]);

    const handleLogout = () => {
        logout();
    };

    const handleBarCodeScanned = ({ type, data }: any) => {
        setScanned(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Mock verification logic
        try {
            const parsedData = JSON.parse(data);
            if (parsedData.id) {
                setStudentData({ id: parsedData.id, name: 'Ayush Kumar', slot: 'A-12' });
                setVerifyStatus('success');
            } else {
                setVerifyStatus('error');
            }
        } catch (e) {
            setVerifyStatus('error');
        }
    };

    const resetScanner = () => {
        setScanned(false);
        setVerifyStatus('idle');
        setStudentData(null);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.card }]}>
                <View>
                    <Text style={[styles.greeting, { color: theme.textSecondary }]}>Security Guard</Text>
                    <Text style={[styles.name, { color: theme.text }]}>{user?.name}</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('ActivityLog')}>
                        <FileText size={24} color={theme.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={handleLogout}>
                        <LogOut size={24} color="#EF4444" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Student Verification</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    Scan student's dynamic QR code to authorize locker access.
                </Text>

                <View style={styles.scannerWrapper}>
                    {!scanned && permission?.granted ? (
                        <View style={styles.cameraContainer}>
                            <CameraView 
                                style={styles.camera}
                                barcodeScannerSettings={{
                                    barcodeTypes: ["qr"],
                                }}
                                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                            />
                            <View style={styles.overlay}>
                                <View style={styles.scanTarget} />
                                <View style={[styles.scanLine, { backgroundColor: theme.primary }]} />
                            </View>
                        </View>
                    ) : (
                        <GlassCard style={styles.resultCard} intensity="heavy">
                            {verifyStatus === 'success' ? (
                                <View style={styles.resultContent}>
                                    <View style={[styles.iconCircle, { backgroundColor: '#10B98120' }]}>
                                        <CheckCircle2 size={48} color="#10B981" />
                                    </View>
                                    <Text style={[styles.resultTitle, { color: '#10B981' }]}>Verified</Text>
                                    
                                    <View style={styles.studentInfo}>
                                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Student Name</Text>
                                        <Text style={[styles.infoValue, { color: theme.text }]}>{studentData?.name}</Text>
                                        
                                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Authorized Locker</Text>
                                        <Text style={[styles.infoValue, { color: theme.text }]}>{studentData?.slot}</Text>
                                        
                                        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Package ID</Text>
                                        <Text style={[styles.infoValue, { color: theme.text }]}>{studentData?.id}</Text>
                                    </View>
                                </View>
                            ) : verifyStatus === 'error' ? (
                                <View style={styles.resultContent}>
                                    <View style={[styles.iconCircle, { backgroundColor: '#EF444420' }]}>
                                        <XCircle size={48} color="#EF4444" />
                                    </View>
                                    <Text style={[styles.resultTitle, { color: '#EF4444' }]}>Invalid QR Code</Text>
                                    <Text style={[styles.errorText, { color: theme.textSecondary }]}>
                                        The scanned code is invalid, expired, or doesn't belong to our system.
                                    </Text>
                                </View>
                            ) : (
                                <View style={styles.resultContent}>
                                    <ScanLine size={48} color={theme.textSecondary} />
                                    <Text style={[styles.resultTitle, { color: theme.textSecondary }]}>Camera not available</Text>
                                </View>
                            )}
                            
                            <TouchableOpacity 
                                style={[styles.scanBtn, { backgroundColor: theme.primary }]}
                                onPress={resetScanner}
                            >
                                <Text style={styles.scanBtnText}>Scan Another</Text>
                            </TouchableOpacity>
                        </GlassCard>
                    )}
                </View>

                <View style={styles.footer}>
                    <ShieldCheck size={24} color="#10B981" />
                    <Text style={[styles.footerText, { color: theme.textSecondary }]}>
                        Always verify the student's face with the system record before granting physical access.
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        zIndex: 10,
    },
    greeting: {
        fontSize: 14,
        fontWeight: '500',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 4,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 16,
    },
    actionBtn: {
        padding: 4,
    },
    content: {
        flex: 1,
        padding: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 24,
    },
    scannerWrapper: {
        flex: 1,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#000',
        marginBottom: 24,
    },
    cameraContainer: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    scanTarget: {
        width: width * 0.6,
        height: width * 0.6,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 24,
        backgroundColor: 'transparent',
    },
    scanLine: {
        position: 'absolute',
        width: width * 0.6,
        height: 2,
        top: '50%',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
    },
    resultCard: {
        flex: 1,
        margin: 0,
        borderRadius: 0,
        padding: 24,
        justifyContent: 'space-between',
    },
    resultContent: {
        alignItems: 'center',
        marginTop: 20,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    resultTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    studentInfo: {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.05)',
        padding: 16,
        borderRadius: 16,
    },
    infoLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    errorText: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    scanBtn: {
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        backgroundColor: '#10B98110',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    footerText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 12,
        lineHeight: 18,
    },
});
