import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';

interface GlassCardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    intensity?: 'light' | 'medium' | 'heavy';
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    style,
    intensity = 'medium',
}) => {
    const { theme } = useThemeStore();
    const isDark = theme.mode === 'dark';

    let backgroundColor = isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.8)';
    let borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)';

    if (intensity === 'light') {
        backgroundColor = isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(255, 255, 255, 0.6)';
    } else if (intensity === 'heavy') {
        backgroundColor = isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.95)';
    }

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor,
                    borderColor,
                    shadowColor: isDark ? '#000' : '#475569',
                },
                style,
            ]}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        // Since Expo doesn't support blur view natively without expo-blur (which we didn't add explicitly, though it might be in some presets), 
        // we simulate glassmorphism with semi-transparent backgrounds and subtle borders.
        // A real glass effect on web/iOS uses backdrop-filter, which React Native supports via specific modules.
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 5,
    },
});
