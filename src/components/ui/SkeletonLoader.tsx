import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';

interface SkeletonLoaderProps {
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
    style?: any;
    isLoading?: boolean;
    children?: React.ReactNode;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    width = '100%',
    height = 20,
    borderRadius = 4,
    style,
    isLoading = true,
    children,
}) => {
    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const { theme } = useThemeStore();

    React.useEffect(() => {
        if (!isLoading) return;

        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );

        animation.start();

        return () => animation.stop();
    }, [isLoading]);

    if (!isLoading) {
        return <>{children}</>;
    }

    const opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View
            style={[
                styles.skeleton,
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: theme.textSecondary,
                    opacity,
                },
                style,
            ]}
        />
    );
};

const styles = StyleSheet.create({
    skeleton: {
        overflow: 'hidden',
    },
});
