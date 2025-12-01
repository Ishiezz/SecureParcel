import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TermsPrivacyScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Terms & Privacy</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>Terms of Service</Text>
                <Text style={styles.text}>
                    Welcome to SecureParcel. By using our app, you agree to the following terms:
                    {'\n\n'}
                    1. <Text style={styles.bold}>Usage:</Text> This app is intended for campus deliveries only.
                    {'\n'}
                    2. <Text style={styles.bold}>Account:</Text> You are responsible for maintaining the confidentiality of your account credentials.
                    {'\n'}
                    3. <Text style={styles.bold}>Conduct:</Text> You agree not to misuse the service or interfere with its operation.
                </Text>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Privacy Policy</Text>
                <Text style={styles.text}>
                    Your privacy is important to us. This policy explains how we handle your data:
                    {'\n\n'}
                    1. <Text style={styles.bold}>Data Collection:</Text> We collect your name, student ID, and email to facilitate deliveries.
                    {'\n'}
                    2. <Text style={styles.bold}>Data Usage:</Text> Your data is used solely for the purpose of package management and notification.
                    {'\n'}
                    3. <Text style={styles.bold}>Security:</Text> We implement security measures to protect your personal information.
                </Text>
            </ScrollView>
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
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#D4AF37',
        marginBottom: 10,
        marginTop: 10,
    },
    text: {
        fontSize: 16,
        color: '#B0B0B0',
        lineHeight: 24,
        marginBottom: 10,
    },
    bold: {
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    divider: {
        height: 1,
        backgroundColor: '#333333',
        marginVertical: 20,
    },
});

export default TermsPrivacyScreen;
