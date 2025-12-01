import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const NotificationsScreen = ({ navigation }) => {
    // Mock notifications data
    const notifications = [
        { id: '1', title: 'Package Arrived', message: 'Your package from Amazon has been deposited in Slot A-12.', time: '2 mins ago', read: false },
        { id: '2', title: 'Security Alert', message: 'Please collect your package from Slot B-05 by 6 PM.', time: '1 hour ago', read: true },
        { id: '3', title: 'System Update', message: 'Biometric verification system maintenance scheduled for tonight.', time: '1 day ago', read: true },
    ];

    const renderItem = ({ item }) => (
        <View style={[styles.notificationItem, !item.read && styles.unreadItem]}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                    name={item.title.includes('Package') ? "package-variant" : "bell-outline"}
                    size={24}
                    color="#FFFFFF"
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>{item.time}</Text>
            </View>
            {!item.read && <View style={styles.unreadDot} />}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#1E1E1E',
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    backBtn: {
        padding: 5,
    },
    listContent: {
        padding: 20,
    },
    notificationItem: {
        flexDirection: 'row',
        backgroundColor: '#1E1E1E',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#333333',
    },
    unreadItem: {
        borderLeftWidth: 4,
        borderLeftColor: '#D4AF37',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    unreadIcon: {
        backgroundColor: '#D4AF37',
    },
    readIcon: {
        backgroundColor: '#B0B0B0',
    },
    textContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    time: {
        fontSize: 12,
        color: '#B0B0B0',
    },
    message: {
        fontSize: 14,
        color: '#B0B0B0',
        lineHeight: 20,
    },
});

export default NotificationsScreen;
