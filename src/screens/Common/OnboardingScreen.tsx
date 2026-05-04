import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Package, ShieldCheck, Zap } from 'lucide-react-native';
import { useThemeStore } from '../../store/useThemeStore';

const { width, height } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        title: 'Smart Campus Deliveries',
        description: 'Never miss a package again. Get notified instantly when your parcel arrives in a secure campus locker.',
        icon: Package,
        color: '#3B82F6', // Blue
    },
    {
        id: '2',
        title: 'Bank-Grade Security',
        description: 'Dynamic QR codes, end-to-end encrypted OTPs, and biometric verification ensure only you can collect your items.',
        icon: ShieldCheck,
        color: '#10B981', // Green
    },
    {
        id: '3',
        title: 'Powered by AI',
        description: 'Chat with our AI assistant to track packages, find lockers, or predict pickup wait times.',
        icon: Zap,
        color: '#8B5CF6', // Purple
    },
];

export const OnboardingScreen = () => {
    const { theme } = useThemeStore();
    const navigation = useNavigation<any>();
    const scrollX = useRef(new Animated.Value(0)).current;
    const [currentIndex, setCurrentIndex] = useState(0);
    const slidesRef = useRef<any>(null);

    const viewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems[0]) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollToNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
        } else {
            navigation.replace('Login');
        }
    };

    const renderItem = ({ item }: { item: typeof SLIDES[0] }) => {
        const Icon = item.icon;
        return (
            <View style={[styles.slide, { width }]}>
                <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                    <Icon size={100} color={item.color} strokeWidth={1.5} />
                </View>
                <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.description, { color: theme.textSecondary }]}>{item.description}</Text>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Animated.FlatList
                data={SLIDES}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                bounces={false}
                keyExtractor={(item) => item.id}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                    useNativeDriver: false,
                })}
                onViewableItemsChanged={viewableItemsChanged}
                viewabilityConfig={viewConfig}
                ref={slidesRef}
            />

            <View style={styles.footer}>
                <View style={styles.pagination}>
                    {SLIDES.map((_, i) => {
                        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                        const dotWidth = scrollX.interpolate({
                            inputRange,
                            outputRange: [10, 24, 10],
                            extrapolate: 'clamp',
                        });
                        const opacity = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: 'clamp',
                        });

                        return (
                            <Animated.View
                                key={i}
                                style={[styles.dot, { width: dotWidth, opacity, backgroundColor: theme.primary }]}
                            />
                        );
                    })}
                </View>

                <TouchableOpacity 
                    style={[styles.button, { backgroundColor: theme.primary }]} 
                    onPress={scrollToNext}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.buttonText, { color: theme.mode === 'dark' ? '#000000' : '#FFFFFF' }]}>
                        {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
                    </Text>
                </TouchableOpacity>

                {currentIndex < SLIDES.length - 1 && (
                    <TouchableOpacity onPress={() => navigation.replace('Login')} style={styles.skipButton}>
                        <Text style={[styles.skipText, { color: theme.textSecondary }]}>Skip</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    slide: {
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: height * 0.2,
    },
    iconContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    pagination: {
        flexDirection: 'row',
        height: 10,
        marginBottom: 40,
    },
    dot: {
        height: 10,
        borderRadius: 5,
        marginHorizontal: 8,
    },
    button: {
        width: '100%',
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    skipButton: {
        marginTop: 20,
    },
    skipText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
