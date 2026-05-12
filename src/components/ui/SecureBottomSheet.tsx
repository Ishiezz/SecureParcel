import React, { useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Animated,
    PanResponder,
    Dimensions,
    TouchableWithoutFeedback,
    Modal,
} from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SecureBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    height?: number;
}

export const SecureBottomSheet: React.FC<SecureBottomSheetProps> = ({
    visible,
    onClose,
    children,
    height = SCREEN_HEIGHT * 0.6,
}) => {
    const { theme } = useThemeStore();
    const translateY = useRef(new Animated.Value(height)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    const slideUp = () => {
        Animated.parallel([
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                bounciness: 5,
                speed: 12,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const slideDown = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: height,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => onClose());
    };

    useEffect(() => {
        if (visible) {
            slideUp();
        } else {
            // Usually, visible is set to false from the parent, so we need to handle exit animation
            translateY.setValue(height);
            opacity.setValue(0);
        }
    }, [visible]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    translateY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > height / 4 || gestureState.vy > 0.5) {
                    slideDown();
                } else {
                    slideUp(); // snap back
                }
            },
        })
    ).current;

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="none" onRequestClose={slideDown}>
            <TouchableWithoutFeedback onPress={slideDown}>
                <Animated.View
                    style={[
                        styles.overlay,
                        {
                            backgroundColor: theme.mode === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)',
                            opacity,
                        },
                    ]}
                />
            </TouchableWithoutFeedback>
            <Animated.View
                style={[
                    styles.sheet,
                    {
                        height,
                        backgroundColor: theme.background,
                        transform: [{ translateY }],
                    },
                ]}
            >
                <View {...panResponder.panHandlers} style={styles.handleContainer}>
                    <View style={[styles.handle, { backgroundColor: theme.border }]} />
                </View>
                <View style={styles.content}>{children}</View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 10,
    },
    handleContainer: {
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
    },
    handle: {
        width: 40,
        height: 5,
        borderRadius: 3,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingBottom: 32, // For safe area
    },
});
