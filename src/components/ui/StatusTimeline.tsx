import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Check, Clock, Package, Key, Box } from 'lucide-react-native';
import { useThemeStore } from '../../store/useThemeStore';

export type TimelineStatus = 'pending' | 'stored' | 'verified' | 'collected';

interface StatusTimelineProps {
    currentStatus: TimelineStatus;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus }) => {
    const { theme } = useThemeStore();
    
    const steps = [
        { id: 'pending', label: 'Ordered', icon: Package },
        { id: 'stored', label: 'In Locker', icon: Box },
        { id: 'verified', label: 'Verified', icon: Key },
        { id: 'collected', label: 'Collected', icon: Check },
    ];

    const getCurrentStepIndex = () => {
        return steps.findIndex(s => s.id === currentStatus);
    };

    const currentIndex = getCurrentStepIndex();

    return (
        <View style={styles.container}>
            {steps.map((step, index) => {
                const isActive = index <= currentIndex;
                const isCurrent = index === currentIndex;
                const isLast = index === steps.length - 1;
                
                const Icon = step.icon;
                const color = isActive ? theme.primary : theme.textSecondary;

                // Entry animation for current step
                const scale = useRef(new Animated.Value(isCurrent ? 0 : 1)).current;

                useEffect(() => {
                    if (isCurrent) {
                        Animated.spring(scale, {
                            toValue: 1,
                            friction: 5,
                            tension: 40,
                            useNativeDriver: true,
                        }).start();
                    }
                }, [isCurrent]);

                return (
                    <View key={step.id} style={styles.stepContainer}>
                        <View style={styles.iconWrapper}>
                            <Animated.View 
                                style={[
                                    styles.iconCircle, 
                                    { 
                                        backgroundColor: isActive ? theme.primary + '20' : theme.card,
                                        borderColor: color,
                                        transform: [{ scale }]
                                    }
                                ]}
                            >
                                <Icon size={20} color={color} />
                            </Animated.View>
                            {!isLast && (
                                <View 
                                    style={[
                                        styles.line, 
                                        { backgroundColor: isActive ? theme.primary : theme.border }
                                    ]} 
                                />
                            )}
                        </View>
                        <Text 
                            style={[
                                styles.label, 
                                { 
                                    color: isActive ? theme.text : theme.textSecondary,
                                    fontWeight: isCurrent ? 'bold' : 'normal'
                                }
                            ]}
                        >
                            {step.label}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    stepContainer: {
        alignItems: 'center',
        flex: 1,
    },
    iconWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        alignSelf: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    line: {
        position: 'absolute',
        height: 3,
        width: '100%',
        left: '50%',
        top: 18,
        zIndex: 1,
    },
    label: {
        marginTop: 8,
        fontSize: 12,
        textAlign: 'center',
    },
});
