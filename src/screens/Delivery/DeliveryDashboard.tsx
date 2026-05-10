import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { usePackageStore } from '../../store/usePackageStore';
import { Camera, Package, LogOut, CheckCircle2, History, Send } from 'lucide-react-native';
import { GlassCard } from '../../components/ui/GlassCard';
import * as Haptics from 'expo-haptics';

export default function DeliveryDashboard() {
    const { theme } = useThemeStore();
    const { user, logout } = useAuthStore();
    const navigation = useNavigation<any>();

    const [packageId, setPackageId] = useState('');
    const [studentId, setStudentId] = useState('');
    const [lockerSlot, setLockerSlot] = useState('');
    const [courier, setCourier] = useState('Amazon');
    const [photoUri, setPhotoUri] = useState<string | null>(null);

    const { depositPackage } = usePackageStore();

    const handleLogout = () => {
        logout();
    };

    const handleSubmit = async () => {
        if (!packageId || !studentId || !lockerSlot) return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        const newPkg = {
            id: packageId,
            studentId: studentId,
            studentName: studentId === 'student' ? 'Student User' : studentId,
            deliveryAgentId: user?.id || 'agent-001',
            courier: courier || 'Amazon',
            slot: lockerSlot,
            status: 'stored' as const,
            otp: Math.floor(100000 + Math.random() * 900000).toString(),
            dynamicQr: packageId,
            photoUrl: photoUri || undefined,
            createdAt: new Date().toISOString(),
        };

        const success = await depositPackage(newPkg);
        if (success) {
            alert('Package registered and synchronized successfully!');
        } else {
            alert('Package registered locally. (Firestore Offline)');
        }

        setPackageId('');
        setStudentId('');
        setLockerSlot('');
        setCourier('Amazon');
        setPhotoUri(null);
    };

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <ScrollView 
                style={[styles.container, { backgroundColor: theme.background }]}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <View style={[styles.header, { backgroundColor: theme.card }]}>
                <View>
                    <Text style={[styles.greeting, { color: theme.textSecondary }]}>Delivery Partner</Text>
                    <Text style={[styles.name, { color: theme.text }]}>{user?.name}</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('DeliveryHistory')}>
                        <History size={24} color={theme.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={handleLogout}>
                        <LogOut size={24} color="#EF4444" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>New Delivery</Text>
                
                <GlassCard style={styles.formCard} intensity="light">
                    <View style={styles.inputWrapper}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Tracking / Package ID</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
                            value={packageId}
                            onChangeText={setPackageId}
                            placeholder="Scan or enter ID"
                            placeholderTextColor={theme.textSecondary}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Student ID</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
                            value={studentId}
                            onChangeText={setStudentId}
                            placeholder="Enter student ID"
                            placeholderTextColor={theme.textSecondary}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Courier Partner</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
                            value={courier}
                            onChangeText={setCourier}
                            placeholder="e.g. Amazon, DHL, FedEx"
                            placeholderTextColor={theme.textSecondary}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Locker Slot Assigned</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
                            value={lockerSlot}
                            onChangeText={setLockerSlot}
                            placeholder="e.g. A-12"
                            placeholderTextColor={theme.textSecondary}
                        />
                    </View>

                    <View style={styles.photoSection}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Proof of Delivery (Optional)</Text>
                        <TouchableOpacity 
                            style={[styles.photoBtn, { backgroundColor: theme.primary + '10', borderColor: theme.primary }]}
                            onPress={() => navigation.navigate('PackagePhoto', { onCapture: setPhotoUri })}
                        >
                            {photoUri ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <CheckCircle2 size={24} color="#10B981" />
                                    <Text style={[styles.photoBtnText, { color: '#10B981', marginLeft: 8 }]}>Photo Captured</Text>
                                </View>
                            ) : (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Camera size={24} color={theme.primary} />
                                    <Text style={[styles.photoBtnText, { color: theme.primary, marginLeft: 8 }]}>Take Photo</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity 
                        style={[styles.submitBtn, { backgroundColor: theme.primary }, (!packageId || !studentId || !lockerSlot) && { opacity: 0.5 }]}
                        onPress={handleSubmit}
                        disabled={!packageId || !studentId || !lockerSlot}
                    >
                        <Send size={20} color={theme.mode === 'dark' ? '#000000' : '#FFFFFF'} style={{ marginRight: 8 }} />
                        <Text style={[styles.submitBtnText, { color: theme.mode === 'dark' ? '#000000' : '#FFFFFF' }]}>Register Package</Text>
                    </TouchableOpacity>
                </GlassCard>

                <View style={styles.statsRow}>
                    <GlassCard style={styles.statCard} intensity="light">
                        <Package size={24} color="#3B82F6" />
                        <Text style={[styles.statValue, { color: theme.text }]}>12</Text>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Delivered Today</Text>
                    </GlassCard>
                </View>
            </View>
        </ScrollView>
    </KeyboardAvoidingView>
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
        padding: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    formCard: {
        padding: 20,
    },
    inputWrapper: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        height: 50,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    photoSection: {
        marginBottom: 24,
    },
    photoBtn: {
        height: 56,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    photoBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    submitBtn: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    statsRow: {
        marginTop: 24,
    },
    statCard: {
        padding: 20,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 14,
    },
});
