import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';
import { usePackageStore } from '../store/usePackageStore';
import * as Haptics from 'expo-haptics';

interface Props {
  onSelectSlot: (slotId: string) => void;
  selectedSlot: string;
}

export const VisualLockerMap: React.FC<Props> = ({ onSelectSlot, selectedSlot }) => {
  const { colors } = useThemeStore();
  const { lockers } = usePackageStore();

  const handleSelect = (id: string, status: string) => {
    if (status !== 'available') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    Haptics.selectionAsync();
    onSelectSlot(id);
  };

  const getLockerColor = (status: string, id: string) => {
    if (id === selectedSlot) return colors.primary;
    if (status === 'occupied') return colors.error + '40'; // Semi-transparent red
    if (status === 'reserved') return colors.textSecondary + '40';
    return colors.glassBorder; // Available
  };

  const renderLocker = (locker: any) => {
    const isSelected = locker.id === selectedSlot;
    const isAvailable = locker.status === 'available';

    return (
      <TouchableOpacity
        key={locker.id}
        style={[
          styles.lockerSlot,
          { 
            backgroundColor: getLockerColor(locker.status, locker.id),
            borderColor: isSelected ? colors.primary : (isAvailable ? colors.primary + '50' : colors.glassBorder),
            height: locker.size === 'L' ? 120 : locker.size === 'M' ? 80 : 60,
          }
        ]}
        activeOpacity={isAvailable ? 0.7 : 1}
        onPress={() => handleSelect(locker.id, locker.status)}
      >
        <Text style={[
          styles.lockerId, 
          { color: isSelected ? colors.white : colors.textPrimary }
        ]}>
          {locker.id}
        </Text>
        <Text style={[
          styles.lockerStatus,
          { color: isSelected ? colors.white : (isAvailable ? colors.primary : colors.textSecondary) }
        ]}>
          {isAvailable ? 'Available' : 'In Use'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Select Locker Slot</Text>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.glassBorder, borderColor: colors.primary + '50', borderWidth: 1 }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.primary }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Selected</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.error + '40' }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>In Use</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.lockerBank}>
          {lockers.filter(l => l.size === 'S').map(renderLocker)}
        </View>
        <View style={styles.lockerBank}>
          {lockers.filter(l => l.size === 'M').map(renderLocker)}
        </View>
        <View style={styles.lockerBank}>
          {lockers.filter(l => l.size === 'L').map(renderLocker)}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  legend: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
  },
  scrollContainer: {
    gap: 12,
  },
  lockerBank: {
    width: 100,
    gap: 8,
  },
  lockerSlot: {
    borderWidth: 1.5,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  lockerId: {
    fontSize: 16,
    fontWeight: '800',
  },
  lockerStatus: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
});
