import React, { useEffect, useRef, useState } from 'react';
import { Text, Animated, StyleSheet, TextStyle, StyleProp } from 'react-native';

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    style?: StyleProp<TextStyle>;
    formatter?: (val: number) => string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
    value,
    duration = 1000,
    style,
    formatter = (val) => Math.floor(val).toString(),
}) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        animatedValue.addListener((state) => {
            setDisplayValue(state.value);
        });

        Animated.timing(animatedValue, {
            toValue: value,
            duration,
            useNativeDriver: false, // Cannot use native driver for text interpolation
        }).start();

        return () => {
            animatedValue.removeAllListeners();
        };
    }, [value]);

    return (
        <Text style={[styles.text, style]}>
            {formatter(displayValue)}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        fontVariant: ['tabular-nums'], // Keep numbers aligned
    },
});
