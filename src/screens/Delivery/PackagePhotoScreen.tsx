import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useNavigation, useRoute } from '@react-navigation/native';
import { X, Check, Camera, RefreshCw } from 'lucide-react-native';
import { useThemeStore } from '../../store/useThemeStore';
import * as Haptics from 'expo-haptics';

export const PackagePhotoScreen = () => {
    const { theme } = useThemeStore();
    const navigation = useNavigation();
    const route = useRoute<any>();
    
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const cameraRef = useRef<any>(null);

    const onCapture = route.params?.onCapture;

    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, [permission]);

    if (!permission) {
        return <View style={[styles.container, { backgroundColor: theme.background }]} />;
    }

    if (!permission.granted) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: theme.text, textAlign: 'center', marginBottom: 16 }}>
                    We need your permission to show the camera for package proof.
                </Text>
                <TouchableOpacity onPress={requestPermission} style={[styles.button, { backgroundColor: theme.primary }]}>
                    <Text style={[styles.buttonText, { color: theme.mode === 'dark' ? '#000000' : '#FFFFFF' }]}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
            setPhotoUri(photo.uri);
        }
    };

    const confirmPhoto = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (onCapture && photoUri) {
            onCapture(photoUri);
        }
        navigation.goBack();
    };

    const retakePhoto = () => {
        setPhotoUri(null);
    };

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <X size={28} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Capture Package Proof</Text>
                {photoUri ? (
                    <View style={{ width: 44 }} />
                ) : (
                    <TouchableOpacity onPress={toggleCameraFacing} style={styles.iconBtn}>
                        <RefreshCw size={24} color="#FFF" />
                    </TouchableOpacity>
                )}
            </View>

            {photoUri ? (
                <View style={styles.previewContainer}>
                    <Image source={{ uri: photoUri }} style={styles.preview} />
                    <View style={styles.controls}>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#374151' }]} onPress={retakePhoto}>
                            <Text style={styles.actionText}>Retake</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#10B981' }]} onPress={confirmPhoto}>
                            <Check size={24} color="#FFF" style={{ marginRight: 8 }} />
                            <Text style={styles.actionText}>Use Photo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
                    <View style={styles.overlay}>
                        <View style={styles.targetBox} />
                    </View>
                    <View style={styles.controls}>
                        <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
                            <View style={styles.captureInner} />
                        </TouchableOpacity>
                    </View>
                </CameraView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        zIndex: 10,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    iconBtn: {
        padding: 8,
    },
    camera: {
        flex: 1,
    },
    previewContainer: {
        flex: 1,
    },
    preview: {
        flex: 1,
        width: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    targetBox: {
        width: '80%',
        aspectRatio: 1,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
        borderRadius: 16,
    },
    controls: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingBottom: 40,
        paddingTop: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    captureBtn: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    captureInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFF',
    },
    actionBtn: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
    },
    actionText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    button: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 12,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
