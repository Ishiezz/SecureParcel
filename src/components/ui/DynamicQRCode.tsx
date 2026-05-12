import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '../../store/useThemeStore';

const { width } = Dimensions.get('window');

interface Props {
  data: string;
}

export const DynamicQRCode: React.FC<Props> = ({ data }) => {
  const { theme } = useThemeStore();
  const [timestamp, setTimestamp] = useState(Date.now());
  const [progress, setProgress] = useState(1);
  const opacity = React.useRef(new Animated.Value(1)).current;

  const duration = 30000; // 30 seconds

  useEffect(() => {
    let animationFrameId: number;
    let startTime = Date.now();

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      
      if (elapsed >= duration) {
        // Trigger pulse animation
        Animated.sequence([
            Animated.timing(opacity, { toValue: 0.2, duration: 150, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true })
        ]).start();

        startTime = now;
        setTimestamp(now);
        setProgress(1);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        setProgress(1 - elapsed / duration);
      }
      
      animationFrameId = requestAnimationFrame(updateTimer);
    };

    animationFrameId = requestAnimationFrame(updateTimer);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const qrValue = JSON.stringify({ id: data, t: timestamp });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.qrContainer, { backgroundColor: '#FFFFFF', opacity }]}>
        <QRCode
          value={qrValue}
          size={width * 0.55}
          color={'#000000'}
          backgroundColor={'#FFFFFF'}
          logoBackgroundColor="transparent"
        />
      </Animated.View>
      <View style={styles.timerContainer}>
        <Text style={[styles.timerText, { color: theme.textSecondary }]}>
          Code refreshes in {Math.ceil(progress * 30)}s
        </Text>
        <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
          <View style={[styles.progressBarFill, { backgroundColor: theme.primary, width: `${progress * 100}%` }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  qrContainer: {
    padding: 16,
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  timerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    fontVariant: ['tabular-nums'],
  },
  progressBarBg: {
    width: '80%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
