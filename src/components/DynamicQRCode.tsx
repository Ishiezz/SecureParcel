import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '../store/useThemeStore';

const { width } = Dimensions.get('window');

interface Props {
  data: string; // The base data, e.g., package ID
}

const DynamicQRCode: React.FC<Props> = ({ data }) => {
  const { colors } = useThemeStore();
  const [timestamp, setTimestamp] = useState(Date.now());
  const [progress, setProgress] = useState(1);

  const duration = 30000; // 30 seconds

  useEffect(() => {
    let animationFrameId: number;
    let startTime = Date.now();

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      
      if (elapsed >= duration) {
        // Reset timer and update QR code
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

  // The actual QR code string incorporates the changing timestamp
  const qrValue = JSON.stringify({ id: data, t: timestamp });

  return (
    <View style={styles.container}>
      <View style={[styles.qrContainer, { backgroundColor: colors.white }]}>
        <QRCode
          value={qrValue}
          size={width * 0.55}
          color={colors.black}
          backgroundColor={colors.white}
          logoBackgroundColor="transparent"
        />
      </View>
      <View style={styles.timerContainer}>
        <Text style={[styles.timerText, { color: colors.textSecondary }]}>
          Code refreshes in {Math.ceil(progress * 30)}s
        </Text>
        <View style={[styles.progressBarBg, { backgroundColor: colors.glassBorder }]}>
          <View style={[styles.progressBarFill, { backgroundColor: colors.primary, width: `${progress * 100}%` }]} />
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
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  timerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBarBg: {
    width: '80%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
});

export default DynamicQRCode;
