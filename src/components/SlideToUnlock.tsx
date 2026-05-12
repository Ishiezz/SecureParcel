import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';
import * as Haptics from 'expo-haptics';
import { Unlock, Lock } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width - 48; // padding 24 on each side
const KNOB_SIZE = 56;
const MAX_TRAVEL = SLIDER_WIDTH - KNOB_SIZE - 12; // 6px padding inside slider

interface Props {
    onUnlock: () => void;
    lockerId: string;
}

export const SlideToUnlock: React.FC<Props> = ({ onUnlock, lockerId }) => {
    const { colors } = useThemeStore();
    const pan = useRef(new Animated.Value(0)).current;
    const [unlocked, setUnlocked] = useState(false);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => !unlocked,
            onMoveShouldSetPanResponder: () => !unlocked,
            onPanResponderGrant: () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            },
            onPanResponderMove: (_, gestureState) => {
                if (unlocked) return;
                
                let newX = gestureState.dx;
                if (newX < 0) newX = 0;
                if (newX > MAX_TRAVEL) newX = MAX_TRAVEL;
                
                pan.setValue(newX);
            },
            onPanResponderRelease: (_, gestureState) => {
                if (unlocked) return;

                if (gestureState.dx > MAX_TRAVEL * 0.8) {
                    // Success! Unlock triggered
                    Animated.spring(pan, {
                        toValue: MAX_TRAVEL,
                        useNativeDriver: false,
                        bounciness: 0,
                    }).start(() => {
                        setUnlocked(true);
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        onUnlock();
                    });
                } else {
                    // Snap back
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
                    Animated.spring(pan, {
                        toValue: 0,
                        useNativeDriver: false,
                        bounciness: 12,
                    }).start();
                }
            },
        })
    ).current;

    const fillWidth = pan.interpolate({
        inputRange: [0, MAX_TRAVEL],
        outputRange: [KNOB_SIZE + 12, SLIDER_WIDTH],
        extrapolate: 'clamp',
    });

    const textColor = pan.interpolate({
        inputRange: [0, MAX_TRAVEL / 2],
        outputRange: [colors.textPrimary, 'rgba(255,255,255,0)'],
        extrapolate: 'clamp',
    });

    return (
        <View style={[styles.container, { backgroundColor: colors.glassBackground, borderColor: colors.glassBorder }]}>
            <Animated.View style={[styles.fill, { width: fillWidth, backgroundColor: unlocked ? colors.success : 'rgba(255,255,255,0.1)' }]} />
            
            <Animated.Text style={[styles.text, { color: textColor }]}>
                Slide to open {lockerId}
            </Animated.Text>

            <Animated.View
                style={[
                    styles.knob,
                    { 
                        backgroundColor: unlocked ? colors.white : colors.primary,
                        transform: [{ translateX: pan }] 
                    }
                ]}
                {...panResponder.panHandlers}
            >
                {unlocked ? (
                    <Unlock size={24} color={colors.black} />
                ) : (
                    <Lock size={24} color={colors.black} />
                )}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 68,
        width: '100%',
        borderRadius: 34,
        borderWidth: 1,
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    fill: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        borderRadius: 34,
    },
    text: {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
        zIndex: 1,
        pointerEvents: 'none',
    },
    knob: {
        position: 'absolute',
        left: 6,
        width: KNOB_SIZE,
        height: KNOB_SIZE,
        borderRadius: KNOB_SIZE / 2,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
});
