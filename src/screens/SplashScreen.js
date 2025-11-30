import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
    const [status, setStatus] = useState({});

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Video
                style={styles.video}
                source={require('../../assets/Sp1.mp4')}
                resizeMode={ResizeMode.COVER}
                shouldPlay
                isLooping={false}
                onPlaybackStatusUpdate={status => {
                    setStatus(() => status);
                    if (status.didJustFinish) {
                        onFinish();
                    }
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    video: {
        width: width,
        height: height,
    },
});

export default SplashScreen;
