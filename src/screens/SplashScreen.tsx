import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity, Easing, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Package, ShieldCheck, Clock, Fingerprint, Activity } from 'lucide-react-native';
import { useThemeStore } from '../store/useThemeStore';

const { width, height } = Dimensions.get('window');

type Props = {
    onFinish: () => void;
};

const SplashScreen: React.FC<Props> = ({ onFinish }) => {
    const { colors, themeMode } = useThemeStore();
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateYAnim = useRef(new Animated.Value(50)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
                easing: Easing.out(Easing.exp)
            }),
            Animated.timing(translateYAnim, {
                toValue: 0,
                duration: 1200,
                useNativeDriver: true,
                easing: Easing.out(Easing.exp)
            })
        ]).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 2000,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease)
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease)
                })
            ])
        ).start();
    }, []);

    const handleFinish = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
                easing: Easing.inOut(Easing.ease)
            }),
            Animated.timing(translateYAnim, {
                toValue: 30,
                duration: 400,
                useNativeDriver: true,
                easing: Easing.inOut(Easing.ease)
            })
        ]).start(() => {
            onFinish();
        });
    };

    const features = [
        { icon: Clock, text: "Asynchronous Pickup" },
        { icon: Package, text: "Secure Smart Lockers" },
        { icon: Fingerprint, text: "Biometric Security" },
        { icon: Activity, text: "Real-time Tracking" },
        { icon: ShieldCheck, text: "Campus Verified" }
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
            
            <LinearGradient
                colors={[colors.primary + '30', colors.background, colors.background]}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView style={styles.contentContainer}>
                <Animated.View style={[styles.mainContent, { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }]}>
                    <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
                        <Image 
                            source={require('../../assets/icon.png')} 
                            style={styles.logoImage} 
                            resizeMode="contain" 
                        />
                    </Animated.View>

                    <Text style={[styles.title, { color: colors.textPrimary }]}>SecureParcel</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Secure, Asynchronous Delivery</Text>

                    <View style={styles.featuresList}>
                        {features.map((feat, index) => {
                            const Icon = feat.icon;
                            return (
                                <View key={index} style={styles.featureItem}>
                                    <Icon size={20} color={colors.primary} strokeWidth={2} />
                                    <Text style={[styles.featureText, { color: colors.textPrimary }]}>{feat.text}</Text>
                                </View>
                            )
                        })}
                    </View>
                </Animated.View>

                <Animated.View style={[styles.bottomSection, { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }]}>
                    <TouchableOpacity 
                        style={[styles.button, { backgroundColor: colors.primary }]} 
                        onPress={handleFinish} 
                        activeOpacity={0.9}
                    >
                        <Text style={[styles.buttonText, { color: colors.mode === 'dark' ? '#000000' : '#FFFFFF' }]}>Get Started</Text>
                        <View style={[styles.arrowCircle, { backgroundColor: colors.mode === 'dark' ? '#000000' : '#FFFFFF' }]}>
                            <ArrowRight size={20} color={colors.primary} />
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    iconContainer: {
        width: 140,
        height: 140,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        overflow: 'hidden',
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 42,
        fontWeight: '800',
        letterSpacing: 0.5,
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 40,
        paddingHorizontal: 20,
        lineHeight: 24,
    },
    featuresList: {
        width: '100%',
        paddingHorizontal: 20,
        gap: 16,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    featureText: {
        fontSize: 16,
        fontWeight: '500',
        letterSpacing: 0.3,
    },
    bottomSection: {
        marginBottom: 20,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginLeft: 10,
    },
    arrowCircle: {
        width: 44,
        height: 44,
        backgroundColor: '#fff',
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SplashScreen;
