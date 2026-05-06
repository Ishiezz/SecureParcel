import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useThemeStore } from '../../store/useThemeStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { Bell, Package, Info, ShieldAlert, CheckCircle2 } from 'lucide-react-native';
import { AnimatedCard } from '../../components/ui/AnimatedCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsScreen() {
    const { theme } = useThemeStore();
    const navigation = useNavigation<any>();
    const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead, isLoading } = useNotificationStore();

    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [fetchNotifications])
    );

    const getIcon = (type: string, isRead: boolean) => {
        const color = isRead ? theme.textSecondary : theme.primary;
        switch (type) {
            case 'delivery': return <Package size={24} color={color} />;
            case 'alert': return <ShieldAlert size={24} color="#EF4444" />;
            case 'system': return <Info size={24} color={color} />;
            default: return <Bell size={24} color={color} />;
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <AnimatedCard 
            style={[styles.notificationCard, !item.read && { backgroundColor: theme.primary + '10', borderColor: theme.primary, borderWidth: 1 }]}
            onPress={() => {
                if (!item.read) markAsRead(item.id);
                // Handle navigation based on type if needed
            }}
        >
            <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                    {getIcon(item.type, item.read)}
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: theme.text }, !item.read && { fontWeight: 'bold' }]}>
                        {item.title}
                    </Text>
                    <Text style={[styles.body, { color: theme.textSecondary }]}>
                        {item.body}
                    </Text>
                    <Text style={[styles.time, { color: theme.textSecondary }]}>
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </Text>
                </View>
                {!item.read && <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />}
            </View>
        </AnimatedCard>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.card }]}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Notifications</Text>
                {unreadCount > 0 && (
                    <TouchableOpacity onPress={markAllAsRead} style={styles.markAllBtn}>
                        <CheckCircle2 size={16} color={theme.primary} style={{ marginRight: 4 }} />
                        <Text style={[styles.markAllText, { color: theme.primary }]}>Mark all read</Text>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchNotifications} tintColor={theme.primary} />}
                ListEmptyComponent={<EmptyState type="notifications" />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingBottom: 16,
        paddingHorizontal: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    markAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    markAllText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    listContainer: {
        padding: 24,
        paddingTop: 16,
        flexGrow: 1,
    },
    notificationCard: {
        marginBottom: 12,
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconContainer: {
        marginRight: 16,
        marginTop: 2,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        marginBottom: 4,
    },
    body: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    time: {
        fontSize: 12,
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginTop: 6,
        marginLeft: 8,
    },
});
