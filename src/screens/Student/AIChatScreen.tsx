import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeStore } from '../../store/useThemeStore';
import { useAIStore } from '../../store/useAIStore';
import { useAuthStore } from '../../store/useAuthStore';
import { usePackageStore } from '../../store/usePackageStore';
import { ChevronLeft, Send, Sparkles, Bot, User, Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function AIChatScreen() {
    const { theme } = useThemeStore();
    const navigation = useNavigation<any>();
    const { messages, isTyping, sendMessage, clearHistory, dailyUsageCount } = useAIStore();
    const { user } = useAuthStore();
    const { packages, lockers } = usePackageStore();

    const [input, setInput] = useState('');
    const flatListRef = useRef<FlatList>(null);
    
    const isPremium = user?.premiumTier === 'premium';

    useEffect(() => {
        // Scroll to bottom on new messages
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages, isTyping]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                }, 50);
            }
        );
        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);

    const handleSend = () => {
        if (!input.trim() || isTyping) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const text = input.trim();
        setInput('');
        
        const context = {
            studentId: user?.id || '',
            userName: user?.name || '',
            activePackages: packages.filter(p => p.status === 'stored' || p.status === 'pending'),
            lockers: lockers
        };

        sendMessage(text, context, isPremium);
    };

    const handleClear = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        clearHistory();
    };

    const renderMessage = ({ item }: { item: any }) => {
        const isUser = item.sender === 'user';
        return (
            <View style={[styles.messageWrapper, isUser ? styles.messageWrapperUser : styles.messageWrapperAI]}>
                {!isUser && (
                    <View style={[styles.avatar, { backgroundColor: theme.primary + '20' }]}>
                        <Bot size={16} color={theme.primary} />
                    </View>
                )}
                <View style={[
                    styles.messageBubble,
                    isUser ? [styles.messageUser, { backgroundColor: theme.primary }] : [styles.messageAI, { backgroundColor: theme.card }],
                    item.error && { backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#EF4444' }
                ]}>
                    <Text style={[
                        styles.messageText,
                        { color: isUser ? (theme.mode === 'dark' ? '#000000' : '#FFFFFF') : theme.text },
                        item.error && { color: '#EF4444' }
                    ]}>
                        {item.text}
                    </Text>
                    {item.provider && (
                        <Text style={[styles.providerText, { color: theme.textSecondary }]}>
                            via {item.provider}
                        </Text>
                    )}
                </View>
                {isUser && (
                    <View style={[styles.avatar, { backgroundColor: theme.textSecondary + '20' }]}>
                        <User size={16} color={theme.textSecondary} />
                    </View>
                )}
            </View>
        );
    };

    return (
        <KeyboardAvoidingView 
            style={[styles.container, { backgroundColor: theme.background }]} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
        >
            <View style={[styles.header, { backgroundColor: theme.card }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <ChevronLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>AI Assistant</Text>
                    <View style={styles.statusBadge}>
                        <Sparkles size={12} color="#F59E0B" style={{ marginRight: 4 }} />
                        <Text style={styles.statusText}>{isPremium ? 'Premium' : `${10 - dailyUsageCount} left`}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={handleClear} style={styles.iconBtn}>
                    <Trash2 size={20} color={theme.textSecondary} />
                </TouchableOpacity>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                contentContainerStyle={styles.chatContainer}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            />

            {isTyping && (
                <View style={styles.typingIndicator}>
                    <ActivityIndicator size="small" color={theme.primary} />
                    <Text style={[styles.typingText, { color: theme.textSecondary }]}>AI is thinking...</Text>
                </View>
            )}

            <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
                <TextInput
                    style={[styles.input, { color: theme.text, backgroundColor: theme.background }]}
                    placeholder="Ask about your packages..."
                    placeholderTextColor={theme.textSecondary}
                    value={input}
                    onChangeText={setInput}
                    multiline
                    maxLength={500}
                    onSubmitEditing={handleSend}
                />
                <TouchableOpacity 
                    style={[
                        styles.sendBtn, 
                        { backgroundColor: input.trim() ? theme.primary : theme.border }
                    ]} 
                    onPress={handleSend}
                    disabled={!input.trim() || isTyping}
                >
                    <Send size={20} color={input.trim() ? (theme.mode === 'dark' ? '#000000' : '#FFFFFF') : theme.textSecondary} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
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
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        zIndex: 10,
    },
    iconBtn: {
        padding: 8,
    },
    headerTitleContainer: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginTop: 4,
    },
    statusText: {
        fontSize: 10,
        color: '#F59E0B',
        fontWeight: 'bold',
    },
    chatContainer: {
        padding: 16,
        paddingBottom: 24,
    },
    messageWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 16,
    },
    messageWrapperUser: {
        justifyContent: 'flex-end',
    },
    messageWrapperAI: {
        justifyContent: 'flex-start',
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8,
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 20,
    },
    messageUser: {
        borderBottomRightRadius: 4,
    },
    messageAI: {
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    providerText: {
        fontSize: 9,
        marginTop: 4,
        textAlign: 'right',
        opacity: 0.7,
    },
    typingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 16,
    },
    typingText: {
        marginLeft: 8,
        fontSize: 13,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingBottom: Platform.OS === 'ios' ? 32 : 12,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
    input: {
        flex: 1,
        minHeight: 44,
        maxHeight: 120,
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        fontSize: 15,
        marginRight: 12,
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
