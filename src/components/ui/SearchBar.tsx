import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useThemeStore } from '../../store/useThemeStore';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onClear?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChangeText,
    placeholder = 'Search...',
    onClear,
}) => {
    const { theme } = useThemeStore();
    const isFocused = React.useRef(new Animated.Value(0)).current;

    const handleFocus = () => {
        Animated.timing(isFocused, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const handleBlur = () => {
        Animated.timing(isFocused, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const handleClear = () => {
        onChangeText('');
        if (onClear) onClear();
    };

    const borderColor = isFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['transparent', theme.primary],
    });

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    backgroundColor: theme.card,
                    borderColor,
                    borderWidth: 1.5,
                },
            ]}
        >
            <Search size={20} color={theme.textSecondary} style={styles.icon} />
            <TextInput
                style={[styles.input, { color: theme.text }]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.textSecondary}
                onFocus={handleFocus}
                onBlur={handleBlur}
                clearButtonMode="never"
            />
            {value.length > 0 && (
                <TouchableOpacity onPress={handleClear} style={styles.clearButton} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                    <X size={18} color={theme.textSecondary} />
                </TouchableOpacity>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 50,
        marginVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        height: '100%',
    },
    clearButton: {
        marginLeft: 12,
        padding: 4,
    },
});
