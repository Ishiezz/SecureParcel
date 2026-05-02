import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

const TermsPrivacyScreen: React.FC<Props> = ({ navigation }) => {
    const { colors } = useThemeStore();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.glassBorder }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Terms & Privacy</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={[styles.glassCard, { borderColor: colors.glassBorder, backgroundColor: 'rgba(255,255,255,0.03)' }]}>
                    <Text style={[styles.sectionTitle, { color: colors.primary }]}>Terms of Service</Text>
                    <Text style={[styles.text, { color: colors.textSecondary }]}>
                        Welcome to SecureParcel. By using our app, you agree to the following terms:
                        {'\n\n'}
                        1. <Text style={[styles.bold, { color: colors.textPrimary }]}>Usage:</Text> This app is intended for campus deliveries only.
                        {'\n'}
                        2. <Text style={[styles.bold, { color: colors.textPrimary }]}>Account:</Text> You are responsible for maintaining the confidentiality of your account credentials.
                        {'\n'}
                        3. <Text style={[styles.bold, { color: colors.textPrimary }]}>Conduct:</Text> You agree not to misuse the service or interfere with its operation.
                    </Text>
                </View>

                <View style={[styles.glassCard, { borderColor: colors.glassBorder, backgroundColor: 'rgba(255,255,255,0.03)' }]}>
                    <Text style={[styles.sectionTitle, { color: colors.primary }]}>Privacy Policy</Text>
                    <Text style={[styles.text, { color: colors.textSecondary }]}>
                        Your privacy is important to us. This policy explains how we handle your data:
                        {'\n\n'}
                        1. <Text style={[styles.bold, { color: colors.textPrimary }]}>Data Collection:</Text> We collect your name, ID, and email to facilitate deliveries securely.
                        {'\n'}
                        2. <Text style={[styles.bold, { color: colors.textPrimary }]}>Data Usage:</Text> Your data is used solely for the purpose of package management and notification.
                        {'\n'}
                        3. <Text style={[styles.bold, { color: colors.textPrimary }]}>Security:</Text> We implement strict security measures including encryption and Firebase protected endpoints to protect your personal information.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
    },
    backButton: {
        marginRight: 15,
        padding: 8,
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    glassCard: {
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
        borderWidth: 1,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 16,
    },
    text: {
        fontSize: 16,
        lineHeight: 26,
    },
    bold: {
        fontWeight: '700',
    },
});

export default TermsPrivacyScreen;
