import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList, Image } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
    const [activeDot, setActiveDot] = React.useState(0);

    const features = [
        { icon: "clock-fast", text: "Asynchronous Pickup" },
        { icon: "locker", text: "Secure Smart Lockers" },
        { icon: "fingerprint", text: "Biometric Security" },
        { icon: "radar", text: "Real-time Tracking" },
        { icon: "shield-check", text: "Campus Verified" }
    ];

    const onViewableItemsChanged = React.useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {

            setActiveDot(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = React.useRef({
        itemVisiblePercentThreshold: 50
    }).current;

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <StatusBar style="light" />
            <Video
                style={styles.video}
                source={require('../../assets/splash.mp4')}
                resizeMode={ResizeMode.COVER}
                shouldPlay
                isLooping={true}
                isMuted={true}
            />

            <LinearGradient
                colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
                style={styles.overlay}
            >
                <SafeAreaView style={styles.contentContainer}>

                    <View style={styles.topLogoContainer}>
                        <View style={styles.logoBox}>
                            <Image
                                source={require('../../assets/splash-icon.png')}
                                style={styles.logoImage}
                                resizeMode="contain"
                            />
                        </View>
                    </View>

                    <View style={styles.mainContent}>
                        <Text style={styles.title}>SecureParcel</Text>
                        <Text style={styles.subtitle}>Secure, Asynchronous Delivery</Text>

                        <TouchableOpacity style={styles.button} onPress={onFinish} activeOpacity={0.9}>
                            <Text style={styles.buttonText}>GET STARTED</Text>
                            <View style={styles.arrowCircle}>
                                <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
                            </View>
                        </TouchableOpacity>
                    </View>


                    <View style={styles.bottomSection}>
                        <FlatList
                            data={features}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.pillsScrollContent}
                            keyExtractor={(item) => item.text}
                            renderItem={({ item }) => (
                                <GlassPill icon={item.icon} text={item.text} />
                            )}
                            onViewableItemsChanged={onViewableItemsChanged}
                            viewabilityConfig={viewabilityConfig}
                        />


                        <View style={styles.paginationContainer}>
                            {[0, 1, 2].map((index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.dot,
                                        (activeDot < 2 ? activeDot : 2) === index && styles.activeDot
                                    ]}
                                />
                            ))}
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        </View>
    );
};



const GlassPill = ({ icon, text }) => (
    <View style={styles.pill}>
        <MaterialCommunityIcons name={icon} size={16} color="#fff" style={styles.pillIcon} />
        <Text style={styles.pillText}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    video: {
        width: width,
        height: height,
        position: 'absolute',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    contentContainer: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    topLogoContainer: {
        alignItems: 'flex-start',
        marginTop: 10,
        marginLeft: 10,
    },
    logoBox: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    mainContent: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    title: {
        fontSize: 42,
        fontWeight: '800',
        color: '#fff',
        lineHeight: 48,
        marginBottom: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 10,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 20,
        lineHeight: 24,
        maxWidth: '80%',
    },
    button: {
        backgroundColor: '#fff',
        paddingVertical: 6,
        paddingHorizontal: 11,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        marginBottom: 10,
    },
    buttonText: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    arrowCircle: {
        width: 48,
        height: 48,
        backgroundColor: '#000',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomSection: {
        marginTop: 10,
    },
    pillsScrollContent: {
        paddingHorizontal: 10,
        gap: 10,
        paddingBottom: 20,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        marginRight: 10,
    },
    pillIcon: {
        marginRight: 6,
    },
    pillText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    activeDot: {
        backgroundColor: '#fff',
        width: 10,
        height: 10,
        borderRadius: 5,
    },
});

export default SplashScreen;
