import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { PackageOpen, Inbox, SearchX, ShieldAlert } from 'lucide-react-native';

export type EmptyStateType = 'packages' | 'notifications' | 'search' | 'history' | 'error';

interface EmptyStateProps {
    type?: EmptyStateType;
    title?: string;
    description?: string;
    icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    type = 'packages',
    title,
    description,
    icon,
}) => {
    const { theme } = useThemeStore();

    const getDefaultProps = () => {
        switch (type) {
            case 'packages':
                return {
                    icon: <PackageOpen size={64} color={theme.primary + '80'} strokeWidth={1.5} />,
                    title: 'No Active Packages',
                    description: "You're all caught up! We'll notify you when a new package arrives.",
                };
            case 'notifications':
                return {
                    icon: <Inbox size={64} color={theme.primary + '80'} strokeWidth={1.5} />,
                    title: 'No Notifications',
                    description: 'Your inbox is empty. Check back later!',
                };
            case 'search':
                return {
                    icon: <SearchX size={64} color={theme.textSecondary + '80'} strokeWidth={1.5} />,
                    title: 'No Results Found',
                    description: "We couldn't find anything matching your search.",
                };
            case 'error':
                return {
                    icon: <ShieldAlert size={64} color="#EF444480" strokeWidth={1.5} />,
                    title: 'Something went wrong',
                    description: 'Unable to load data. Please pull down to refresh.',
                };
            default:
                return {
                    icon: <PackageOpen size={64} color={theme.textSecondary + '80'} strokeWidth={1.5} />,
                    title: 'Nothing here',
                    description: 'There is no data to display right now.',
                };
        }
    };

    const defaults = getDefaultProps();
    const finalIcon = icon || defaults.icon;
    const finalTitle = title || defaults.title;
    const finalDescription = description || defaults.description;

    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: theme.card }]}>
                {finalIcon}
            </View>
            <Text style={[styles.title, { color: theme.text }]}>{finalTitle}</Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>{finalDescription}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    description: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        maxWidth: 280,
    },
});
