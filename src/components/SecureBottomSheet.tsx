import React, { forwardRef, useImperativeHandle, useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, Animated, Dimensions, PanResponder } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';

const { height } = Dimensions.get('window');

interface Props {
  children: React.ReactNode;
  snapPoints?: string[]; // Kept for API compatibility, but handled via height percentages
  title?: string;
  onClose?: () => void;
}

export interface BottomSheetRef {
    expand: () => void;
    close: () => void;
}

export const SecureBottomSheet = forwardRef<BottomSheetRef, Props>(({ 
  children, 
  snapPoints = ['50%'], 
  title,
  onClose
}, ref) => {
  const { colors } = useThemeStore();
  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;
  
  // Parse snap point e.g., '55%' -> 0.55 * height
  const defaultHeight = parseFloat(snapPoints[0]) / 100 * height || height * 0.5;

  useImperativeHandle(ref, () => ({
    expand: () => {
      setVisible(true);
    },
    close: () => {
      closeSheet();
    }
  }));

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: height - defaultHeight,
        useNativeDriver: true,
        bounciness: 4,
      }).start();
    }
  }, [visible]);

  const closeSheet = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      if (onClose) onClose();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(height - defaultHeight + gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > defaultHeight * 0.3 || gestureState.vy > 0.5) {
          closeSheet();
        } else {
          // Snap back
          Animated.spring(slideAnim, {
            toValue: height - defaultHeight,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
        }
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={closeSheet}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={closeSheet} />
        <Animated.View 
          style={[
            styles.sheetContainer, 
            { backgroundColor: colors.surface, height: defaultHeight, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.handleContainer} {...panResponder.panHandlers}>
            <View style={[styles.handle, { backgroundColor: colors.textSecondary }]} />
          </View>
          <View style={styles.contentContainer}>
            {title && (
              <View style={styles.header}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
              </View>
            )}
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  handleContainer: {
    paddingVertical: 12,
    alignItems: 'center',
    width: '100%',
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
});
