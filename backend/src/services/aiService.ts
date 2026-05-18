// ============================================================
// AI Service — Groq (priority) → OpenAI → Gemini → Mock
// ============================================================

import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };
type AIProvider = 'groq' | 'openai' | 'gemini' | 'mock';

let groqClient: Groq | null = null;
let openaiClient: OpenAI | null = null;
let geminiClient: GoogleGenerativeAI | null = null;

const SYSTEM_PROMPT = `You are the SecureParcel AI Campus Delivery Assistant — a helpful, friendly, and knowledgeable AI embedded in a campus smart locker management app used by students, delivery agents, and security guards in India.

Your knowledge:
- Campus lockers are in 3 zones: Zone A (Student Union, 6AM-11PM), Zone B (Main Gate, 24/7), Zone C (Library, 8AM-10PM)
- Packages are held for 7 days (14 days for Premium members)
- Collection requires: Dynamic QR code (refreshes every 30s) OR 4-digit OTP, plus guard biometric verification for high-security items
- Couriers supported: Amazon, Flipkart, FedEx, DHL, Blue Dart, DTDC, Delhivery, India Post, and more
- Premium features: Priority lockers, 90-day history, unlimited AI chat, analytics dashboard
- Security: All OTPs are end-to-end encrypted, biometric data never leaves the device

Personality: Warm, professional, campus-aware. Use occasional emojis. Keep responses concise but complete. Always mention relevant app features when appropriate.

IMPORTANT: For any security or emergency issues, direct users to campus security at ext. 1234.`;

export const initAIProviders = (): Record<AIProvider, boolean> => {
    const status: Record<AIProvider, boolean> = { groq: false, openai: false, gemini: false, mock: true };

    if (process.env.GROQ_API_KEY) {
        try {
            groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
            status.groq = true;
            console.log('[AI] Groq initialized');
        } catch {}
    }

    if (process.env.OPENAI_API_KEY) {
        try {
            openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            status.openai = true;
            console.log('[AI] OpenAI initialized');
        } catch {}
    }

    if (process.env.GEMINI_API_KEY) {
        try {
            geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            status.gemini = true;
            console.log('[AI] Gemini initialized');
        } catch {}
    }

    if (!status.groq && !status.openai && !status.gemini) {
        console.warn('[AI] No AI providers configured — using enhanced mock');
    }

    return status;
};

export const getProviderStatus = () => ({
    groq: !!groqClient,
    openai: !!openaiClient,
    gemini: !!geminiClient,
    mock: true,
});

export const chat = async (
    messages: ChatMessage[],
    context?: string
): Promise<{ text: string; provider: AIProvider }> => {
    const systemMessages: ChatMessage[] = [
        { role: 'system', content: SYSTEM_PROMPT + (context ? `\n\nCurrent user context:\n${context}` : '') },
    ];
    const fullMessages = [...systemMessages, ...messages];

    // 1. Try Groq (fastest — Llama 3.3 70B)
    if (groqClient) {
        try {
            const completion = await groqClient.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: fullMessages as any,
                max_tokens: 512,
                temperature: 0.7,
            });
            const text = completion.choices[0]?.message?.content || '';
            if (text) return { text, provider: 'groq' };
        } catch (e: any) {
            console.warn('[AI] Groq failed:', e.message, '— trying OpenAI');
        }
    }

    // 2. Try OpenAI (GPT-4o-mini)
    if (openaiClient) {
        try {
            const completion = await openaiClient.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: fullMessages as any,
                max_tokens: 512,
                temperature: 0.7,
            });
            const text = completion.choices[0]?.message?.content || '';
            if (text) return { text, provider: 'openai' };
        } catch (e: any) {
            console.warn('[AI] OpenAI failed:', e.message, '— trying Gemini');
        }
    }

    // 3. Try Gemini (Flash)
    if (geminiClient) {
        try {
            const model = geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const userText = messages.filter(m => m.role === 'user').pop()?.content || '';
            const result = await model.generateContent(SYSTEM_PROMPT + '\n\nUser: ' + userText);
            const text = result.response.text();
            if (text) return { text, provider: 'gemini' };
        } catch (e: any) {
            console.warn('[AI] Gemini failed:', e.message, '— falling back to mock');
        }
    }

    // 4. Enhanced mock
    const userText = messages.filter(m => m.role === 'user').pop()?.content || '';
    return { text: generateMockResponse(userText), provider: 'mock' };
};

const generateMockResponse = (text: string): string => {
    const lower = text.toLowerCase();
    if (lower.includes('package') || lower.includes('parcel')) {
        return '📦 I can see your package details in the system! For real-time tracking, check your Dashboard. Your OTP and QR code are always available there — show them to the guard for instant pickup!';
    }
    if (lower.includes('locker') || lower.includes('where')) {
        return '🗺️ Campus lockers are at Zone A (Student Union), Zone B (Main Gate), and Zone C (Library). Zone B is open 24/7! Use the Locker Map in the app to see real-time availability.';
    }
    if (lower.includes('otp') || lower.includes('collect') || lower.includes('pickup')) {
        return '🔐 To collect: Open the app → Tap your package → Show the QR code OR 4-digit OTP to the security guard. The guard will verify and release your package. Simple!';
    }
    return `Hi! I'm SecureParcel AI. I can help with package tracking, locker locations, pickup procedures, and more. What would you like to know? (Note: Enhanced AI responses activate when API keys are configured)`;
};
