import React from 'react';
import { ViewStyle, TouchableWithoutFeedback, Animated, StyleProp } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '../../store/useThemeStore';

interface AnimatedCardProps {
    children: React.ReactNode;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    scaleTo?: number;
    delay?: number; // Entry animation delay
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
    children,
    onPress,
    style,
    disabled = false,
    scaleTo = 0.95,
    delay = 0,
}) => {
    const scale = React.useRef(new Animated.Value(1)).current;
    const opacity = React.useRef(new Animated.Value(0)).current;
    const translateY = React.useRef(new Animated.Value(20)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 400,
                delay,
                useNativeDriver: true,
            }),
            Animated.spring(translateY, {
                toValue: 0,
                friction: 8,
                tension: 40,
                delay,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handlePressIn = () => {
        if (disabled || !onPress) return;
        Animated.spring(scale, {
            toValue: scaleTo,
            useNativeDriver: true,
            speed: 20,
            bounciness: 10,
        }).start();
    };

    const handlePressOut = () => {
        if (disabled || !onPress) return;
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
            bounciness: 10,
        }).start();
    };

    const handlePress = () => {
        if (disabled || !onPress) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
    };

    const { theme } = useThemeStore();

    return (
        <TouchableWithoutFeedback
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            disabled={disabled || !onPress}
        >
            <Animated.View
                style={[
                    {
                        transform: [{ scale }, { translateY }],
                        opacity,
                        backgroundColor: theme.card,
                        borderRadius: 20,
                        padding: 16,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: theme.mode === 'dark' ? 0.3 : 0.05,
                        shadowRadius: 12,
                        elevation: 4,
                    },
                    style,
                ]}
            >
                {children}
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};
