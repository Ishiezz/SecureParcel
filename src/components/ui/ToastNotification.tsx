import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, SafeAreaView } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { CheckCircle, AlertCircle, Info } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type?: ToastType;
    visible: boolean;
    onHide: () => void;
    duration?: number;
}

export const ToastNotification: React.FC<ToastProps> = ({
    message,
    type = 'info',
    visible,
    onHide,
    duration = 3000,
}) => {
    const { theme } = useThemeStore();
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Haptic feedback based on type
            if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            if (type === 'error') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: 0,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();

            const timer = setTimeout(() => {
                hideToast();
            }, duration);

            return () => clearTimeout(timer);
        } else {
            hideToast();
        }
    }, [visible]);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (visible) onHide();
        });
    };

    if (!visible) return null;

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={24} color="#10B981" />;
            case 'error': return <AlertCircle size={24} color="#EF4444" />;
            case 'info': return <Info size={24} color="#3B82F6" />;
        }
    };

    const getBgColor = () => {
        if (theme.mode === 'dark') return theme.card;
        switch (type) {
            case 'success': return '#D1FAE5';
            case 'error': return '#FEE2E2';
            case 'info': return '#DBEAFE';
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Animated.View
                style={[
                    styles.container,
                    {
                        backgroundColor: getBgColor(),
                        transform: [{ translateY }],
                        opacity,
                        shadowColor: theme.mode === 'dark' ? '#000' : getBgColor(),
                    },
                ]}
            >
                {getIcon()}
                <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        elevation: 9999,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    message: {
        marginLeft: 12,
        fontSize: 15,
        fontWeight: '600',
        flex: 1,
    },
});
