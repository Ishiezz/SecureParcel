import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { LockerCompartment } from '../../types';
import { useThemeStore } from '../../store/useThemeStore';

interface VisualLockerMapProps {
    lockers: LockerCompartment[];
    onLockerPress?: (locker: LockerCompartment) => void;
    highlightId?: string; // Optional locker ID to highlight (e.g., student's package location)
}

export const VisualLockerMap: React.FC<VisualLockerMapProps> = ({
    lockers,
    onLockerPress,
    highlightId,
}) => {
    const { theme } = useThemeStore();
    
    // Group lockers by zone
    const zones = ['A', 'B', 'C'] as const;
    
    return (
        <View style={styles.container}>
            {zones.map(zone => {
                const zoneLockers = lockers.filter(l => l.zone === zone);
                if (zoneLockers.length === 0) return null;

                return (
                    <View key={zone} style={[styles.zoneContainer, { borderColor: theme.border, backgroundColor: theme.card }]}>
                        <Text style={[styles.zoneTitle, { color: theme.text }]}>Zone {zone}</Text>
                        <View style={styles.grid}>
                            {zoneLockers.map(locker => (
                                <LockerSlot 
                                    key={locker.id} 
                                    locker={locker} 
                                    theme={theme} 
                                    onPress={onLockerPress}
                                    isHighlighted={locker.id === highlightId}
                                />
                            ))}
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

const LockerSlot: React.FC<{
    locker: LockerCompartment;
    theme: any;
    onPress?: (locker: LockerCompartment) => void;
    isHighlighted: boolean;
}> = ({ locker, theme, onPress, isHighlighted }) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isHighlighted) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [isHighlighted]);

    const getStatusColor = () => {
        if (isHighlighted) return theme.primary;
        switch (locker.status) {
            case 'available': return '#10B981'; // Green
            case 'occupied': return '#EF4444'; // Red
            case 'reserved': return '#F59E0B'; // Orange
            case 'maintenance': return '#6B7280'; // Gray
            default: return theme.border;
        }
    };

    const getSizeMultiplier = () => {
        switch (locker.size) {
            case 'S': return 1;
            case 'M': return 1.5;
            case 'L': return 2;
            case 'XL': return 2.5;
            default: return 1;
        }
    };

    return (
        <TouchableOpacity 
            activeOpacity={0.7} 
            onPress={() => onPress && onPress(locker)}
            disabled={!onPress}
        >
            <Animated.View
                style={[
                    styles.slot,
                    {
                        backgroundColor: getStatusColor() + '20',
                        borderColor: getStatusColor(),
                        height: 50 * getSizeMultiplier(),
                        transform: [{ scale: pulseAnim }],
                        shadowColor: isHighlighted ? theme.primary : 'transparent',
                        shadowOpacity: isHighlighted ? 0.4 : 0,
                        shadowRadius: 8,
                    }
                ]}
            >
                <Text style={[styles.slotId, { color: theme.text }]}>{locker.id}</Text>
                <Text style={[styles.slotStatus, { color: getStatusColor() }]}>
                    {locker.size}
                </Text>
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 16,
    },
    zoneContainer: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
    },
    zoneTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    slot: {
        width: 60,
        borderWidth: 2,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    slotId: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    slotStatus: {
        fontSize: 10,
        fontWeight: '600',
        marginTop: 4,
    },
});
