// ============================================================
// AI Store — Persists chat history and handles API calls
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AIMessage, AIContext } from '../types';
import { sendAIMessage } from '../services/aiService';
import { trackEvent, AnalyticsEvents } from '../services/analyticsService';

interface AIState {
    messages: AIMessage[];
    isTyping: boolean;
    dailyUsageCount: number;
    lastUsageDate: string;

    // Actions
    addMessage: (message: Omit<AIMessage, 'id'>) => void;
    clearHistory: () => void;
    
    // Async actions
    sendMessage: (text: string, context: AIContext, isPremium: boolean) => Promise<void>;
}

const WELCOME_MESSAGE: AIMessage = {
    id: 'welcome',
    text: "Hi there! 👋 I'm your SecureParcel Campus Assistant. I can help you track packages, find lockers, or answer any delivery questions. How can I help you today?",
    sender: 'ai',
    timestamp: new Date(),
};

const getTodayString = () => new Date().toISOString().split('T')[0];

export const useAIStore = create<AIState>()(
    devtools(
        persist(
            (set, get) => ({
                messages: [WELCOME_MESSAGE],
                isTyping: false,
                dailyUsageCount: 0,
                lastUsageDate: getTodayString(),

                addMessage: (message) => set(state => ({
                    messages: [...state.messages, { ...message, id: Date.now().toString() }]
                })),

                clearHistory: () => set({ messages: [WELCOME_MESSAGE] }),

                sendMessage: async (text: string, context: AIContext, isPremium: boolean) => {
                    const { messages, dailyUsageCount, lastUsageDate, addMessage } = get();
                    const today = getTodayString();

                    // Usage limit check for free tier
                    if (!isPremium) {
                        const currentCount = lastUsageDate === today ? dailyUsageCount : 0;
                        if (currentCount >= 10) {
                            addMessage({
                                text: "You've reached your daily limit of 10 messages on the Free tier. Upgrade to Premium for unlimited AI access! 💎",
                                sender: 'ai',
                                timestamp: new Date(),
                            });
                            return;
                        }
                        set({ dailyUsageCount: currentCount + 1, lastUsageDate: today });
                    }

                    // 1. Add user message
                    const userMsgId = Date.now().toString();
                    set(state => ({
                        messages: [...state.messages, { id: userMsgId, text, sender: 'user', timestamp: new Date() }],
                        isTyping: true,
                    }));

                    trackEvent(AnalyticsEvents.AI_MESSAGE_SENT);

                    // 2. Format history for API (last 5 messages for context)
                    const apiMessages = get().messages.slice(-5).map(m => ({
                        role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
                        content: m.text,
                    }));

                    // 3. Call AI Service
                    try {
                        const { text: responseText, provider } = await sendAIMessage(apiMessages, context);
                        
                        set(state => ({
                            messages: [...state.messages, { 
                                id: (Date.now() + 1).toString(), 
                                text: responseText, 
                                sender: 'ai', 
                                timestamp: new Date(),
                                provider
                            }],
                            isTyping: false,
                        }));
                    } catch (error) {
                        set(state => ({
                            messages: [...state.messages, { 
                                id: (Date.now() + 1).toString(), 
                                text: "I'm having trouble connecting right now. Please try again in a moment.", 
                                sender: 'ai', 
                                timestamp: new Date(),
                                error: true
                            }],
                            isTyping: false,
                        }));
                    }
                },
            }),
            {
                name: 'ai-storage',
                storage: createJSONStorage(() => AsyncStorage),
                partialize: (state) => ({
                    messages: state.messages.slice(-20), // Keep last 20 messages
                    dailyUsageCount: state.lastUsageDate === getTodayString() ? state.dailyUsageCount : 0,
                    lastUsageDate: getTodayString(),
                }),
            }
        ),
        { name: 'AIStore' }
    )
);
