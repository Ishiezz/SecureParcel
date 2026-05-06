import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeStore } from '../../store/useThemeStore';
import { ChevronLeft, Moon, Sun, Monitor, Bell, Volume2, ShieldCheck, HelpCircle } from 'lucide-react-native';
import { GlassCard } from '../../components/ui/GlassCard';

export default function SettingsScreen() {
    const { theme, toggleThemeMode } = useThemeStore();
    const navigation = useNavigation<any>();

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.surface }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Settings</Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Appearance</Text>
                <GlassCard intensity="light" style={styles.settingsCard}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            {theme.mode === 'dark' ? (
                                <Moon size={20} color={theme.textPrimary} />
                            ) : (
                                <Sun size={20} color={theme.textPrimary} />
                            )}
                            <Text style={[styles.settingText, { color: theme.textPrimary }]}>Dark Mode</Text>
                        </View>
                        <Switch 
                            value={theme.mode === 'dark'} 
                            onValueChange={toggleThemeMode}
                            trackColor={{ false: theme.border, true: theme.primary }}
                        />
                    </View>
                </GlassCard>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Preferences</Text>
                <GlassCard intensity="light" style={styles.settingsCard}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Volume2 size={20} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>In-App Sounds</Text>
                        </View>
                        <Switch 
                            value={true} 
                            onValueChange={() => {}}
                            trackColor={{ false: theme.border, true: theme.primary }}
                        />
                    </View>
                </GlassCard>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Support & About</Text>
                <GlassCard intensity="light" style={styles.settingsCard}>
                    <TouchableOpacity style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <HelpCircle size={20} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>Help Center</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <ShieldCheck size={20} color={theme.text} />
                            <Text style={[styles.settingText, { color: theme.text }]}>Privacy Policy</Text>
                        </View>
                    </TouchableOpacity>
                </GlassCard>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 16,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        zIndex: 10,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    section: {
        paddingHorizontal: 24,
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 12,
        marginLeft: 8,
    },
    settingsCard: {
        padding: 0,
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingText: {
        fontSize: 16,
        marginLeft: 12,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginLeft: 48,
    },
});
