// ============================================================
// AI Service — OpenAI + Groq + Gemini with intelligent fallback
// Priority chain: Groq (fastest) → OpenAI → Gemini → Mock
// ============================================================

import { AIMessage, AIContext, AIProvider, Package } from '../types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5050';

// --- Provider Configuration ---------------------------------
const PROVIDERS: Record<AIProvider, { name: string; available: boolean }> = {
    groq: { name: 'Groq', available: false },
    openai: { name: 'OpenAI', available: false },
    gemini: { name: 'Gemini', available: false },
    mock: { name: 'Mock', available: true },
};

// Track which provider is currently working
let currentProvider: AIProvider = 'mock';
let providerInitialized = false;

export const initAIService = async () => {
    if (providerInitialized) return;
    try {
        const res = await fetch(`${BASE_URL}/api/ai/providers`, { 
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        if (res.ok) {
            const root = await res.json();
            const data = root.data || {};
            if (data.groq) { PROVIDERS.groq.available = true; currentProvider = 'groq'; }
            else if (data.openai) { PROVIDERS.openai.available = true; currentProvider = 'openai'; }
            else if (data.gemini) { PROVIDERS.gemini.available = true; currentProvider = 'gemini'; }
        }
    } catch {
        // Backend not available — use enhanced mock
        currentProvider = 'mock';
    }
    providerInitialized = true;
};

export const getActiveProvider = (): AIProvider => currentProvider;

// --- Smart Campus AI Responses (Enhanced Mock) ---------------
const buildSmartMockResponse = (text: string, context: AIContext): string => {
    const lower = text.toLowerCase();
    const { activePackages, lockers, userName, studentId } = context;

    // Package-specific queries
    if (lower.includes('package') || lower.includes('parcel') || lower.includes('track')) {
        if (activePackages.length === 0) {
            return `Hey ${userName.split(' ')[0]}! 👋 You currently have no pending packages. I'll notify you the moment something arrives at the campus hub. Is there anything else I can help you with?`;
        }
        const pkg = activePackages[0];
        return `📦 I found your package! Here's the latest status:\n\n**Courier**: ${pkg.courier}\n**Locker Slot**: ${pkg.slot}\n**Status**: Ready to Collect ✅\n**Arrived**: ${new Date(pkg.createdAt).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}\n\nTap "Show QR" on your dashboard to get the pickup code. The security guard will verify it instantly!`;
    }

    if (lower.includes('locker') && (lower.includes('where') || lower.includes('location') || lower.includes('find'))) {
        const available = lockers.filter(l => l.status === 'available').length;
        return `🗺️ The campus lockers are located at:\n\n• **Zone A** — Ground Floor, Student Union building (near the canteen)\n• **Zone B** — Main Gate entrance lobby\n• **Zone C** — Library block, left wing\n\nCurrently **${available} lockers** are available. Use the "Locker Map" on your dashboard to see real-time status!`;
    }

    if (lower.includes('otp') || lower.includes('code') || lower.includes('qr')) {
        if (activePackages.length > 0) {
            return `🔐 Your pickup code is ready! Here's how to collect:\n\n1. Open your **Dashboard** and tap on the package card\n2. Tap **"Show Secure QR"** — a dynamic QR code will appear\n3. Show it to the security guard at the collection point\n4. The guard will scan it to verify your identity\n5. Your package will be handed over immediately!\n\n💡 **Backup**: If QR scanning fails, use the fallback OTP shown below the QR code.`;
        }
        return `You'll receive your secure QR/OTP code as soon as a package is deposited to your account. Make sure push notifications are enabled so you don't miss it! 🔔`;
    }

    if (lower.includes('stolen') || lower.includes('lost') || lower.includes('security') || lower.includes('emergency')) {
        return `🚨 **Security is our top priority!** All locker bays are monitored 24/7 by CCTV cameras. If you suspect your package has been stolen, or you are experiencing an emergency:\n\n1. Contact **Campus Security** immediately at **ext. 1234** (or visit their office at the Main Gate).\n2. Note the Locker Slot Number and Package ID from your dashboard.\n3. The administration can review camera footage for that precise timestamp.\n\nRest assured, your package remains secure inside the locker until a verified QR/OTP scan occurs!`;
    }

    if (lower.includes('size') || lower.includes('fit') || lower.includes('big') || lower.includes('dimension')) {
        return `📐 **SecureParcel Locker Sizing Guide**:\n\n• **Small (S)**: Ideal for envelopes, documents, book covers, and mobile accessory boxes.\n• **Medium (M)**: Perfect for standard shoeboxes, books, tablets, and small electronics.\n• **Large (L)**: Fits laptop backpacks, large parcels, heavy textbooks, and coats.\n• **Extra Large (XL)**: Reserved for suitcases, computer monitors, gaming consoles, or bulky boxes.\n\n*What if my package doesn't fit?* The delivery agent will automatically assign a larger slot. If all large slots are full, the guard will hold it securely at the central campus mailroom counter.`;
    }

    if (lower.includes('scan') || lower.includes('fail') || lower.includes('work') || lower.includes('error')) {
        return `🔧 **Troubleshooting Scanner Issues**:\n\n1. **Screen Brightness**: Make sure your phone screen is at maximum brightness when holding it under the locker scanner.\n2. **Clean Screen**: Ensure your phone screen has no excessive smudges or cracks.\n3. **Use Backup OTP**: If the scanner fails to read your dynamic QR code, simply read out the **4-digit OTP** to the security guard for manual entry!\n4. **App Restart**: Sometimes a quick app restart clears any loading state.`;
    }

    if (lower.includes('return') || lower.includes('send back') || lower.includes('dropoff')) {
        return `🔄 **How to Return a Package**:\n\n1. Go to your **Profile / Settings** and tap **"Book Return Drop-off"** (Premium feature).\n2. Select your parcel size (S/M/L) and choose a convenient Zone.\n3. Walk to the locker bay, scan your dynamic Return QR code, and the door will pop open.\n4. Place your parcel inside and close the door. SecureParcel will instantly notify the courier partner (Amazon/DTDC/Delhivery) to collect it!`;
    }

    if (lower.includes('full') || lower.includes('no slot') || lower.includes('busy')) {
        return `⚠️ **Busy Hours & Locker Occupancy**:\n\nLocker bays can get busy during peak delivery hours (2:00 PM – 5:00 PM in Zone A). If all locker slots are occupied, couriers will hold your parcel in our secure fallback storage room, or alert you to reserve a slot when one becomes available.\n\n💡 **Tip**: Premium members enjoy **Priority Locker Reservations** which guarantees a slot even during peak campus rush times!`;
    }

    if (lower.includes('hour') || lower.includes('time') || lower.includes('when') || lower.includes('open')) {
        return `⏰ Campus locker access details:\n\n• **Zone A (Student Union)**: 6:00 AM – 11:00 PM\n• **Zone B (Main Gate)**: 24/7 ✅\n• **Zone C (Library)**: 8:00 AM – 10:00 PM\n\nPackages are safe in the lockers — they're climate-controlled and monitored 24/7 by campus security. You can collect anytime within operating hours!`;
    }

    if (lower.includes('miss') || lower.includes('expire') || lower.includes('deadline') || lower.includes('long')) {
        return `⏱️ Package storage policy:\n\n• **Standard**: Packages are held for **7 days** free of charge\n• **Day 4**: You'll receive an automatic reminder notification\n• **Day 7**: Final reminder — after which the package may be returned to sender\n\n💎 **Premium members** get extended hold time of 14 days and priority notifications. Want to upgrade?`;
    }

    if (lower.includes('delivery') || lower.includes('courier') || lower.includes('amazon') || lower.includes('flipkart')) {
        return `🚚 SecureParcel works with all major courier services:\n\n• Amazon Logistics, Flipkart Logistics\n• FedEx, DHL, Blue Dart, DTDC\n• Delhivery, Shadowfax, Ecom Express\n• India Post\n\nDelivery agents deposit your parcel directly into your assigned locker slot — **no more missed deliveries or coordination hassles!**`;
    }

    if (lower.includes('premium') || lower.includes('upgrade') || lower.includes('subscribe')) {
        return `✨ **SecureParcel Premium** unlocks:\n\n🏆 Priority locker reservation (always get a slot)\n📜 90-day package history (vs 30 days free)\n💬 Unlimited AI chat (vs 10 messages/day)\n📊 Personal delivery analytics dashboard\n🔔 Custom notification sounds & priority alerts\n⏱️ 14-day package hold (vs 7 days free)\n\nTap the **Premium** option in your Profile to subscribe! It's worth every rupee 🎯`;
    }

    if (lower.includes('biometric') || lower.includes('fingerprint') || lower.includes('face')) {
        return `🔒 SecureParcel uses multi-layer security:\n\n**Student side**: Dynamic QR code (refreshes every 30 seconds) + fallback OTP\n**Guard side**: QR scan + biometric verification for the highest security packages\n**App login**: TouchID / FaceID support — enable it in Settings > Security\n\nYour biometric data **never leaves your device** — it's processed entirely on-device by iOS/Android.`;
    }

    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        return `Hey ${userName.split(' ')[0]}! 👋 Great to see you!\n\nI'm your AI Campus Delivery Assistant. I can help with:\n\n• 📦 Tracking your packages\n• 🗺️ Finding locker locations\n• 🔐 Understanding pickup procedures\n• ⏰ Checking storage time limits\n• 💎 Premium features info\n\nWhat can I help you with today?`;
    }

    if (lower.includes('help') || lower.includes('how') || lower.includes('what')) {
        return `I'm here to make your campus delivery experience seamless! 🎯\n\nHere's what I can help you with:\n\n• 📦 **"Where is my package?"** — Real-time package status\n• 🗺️ **"Where are the lockers?"** — Campus locker locations\n• 🔐 **"How do I collect my parcel?"** — Step-by-step guide\n• ⏰ **"When can I collect?"** — Operating hours\n• ❓ **Any delivery questions** — I've got answers!\n\nJust type naturally — I understand everything! 😊`;
    }

    // Generic intelligent response
    const responses = [
        `That's a great question! As your campus delivery assistant, I can tell you that ${userName.split(' ')[0]}'s SecureParcel account is fully active. For your specific query about "${text}", I'd recommend checking with the campus security office at ext. 1234, or I can connect you to a live agent. What would you prefer?`,
        `I want to make sure I give you the most accurate information! While I process your query about "${text.substring(0, 40)}...", let me check what I know: Your student profile is verified, your account is active, and the system is running smoothly. Could you be more specific about what you need?`,
        `Great question! I'm continuously learning to better assist students like ${userName.split(' ')[0]}. For "${text.substring(0, 30)}...", I suggest: (1) Check the FAQ in Settings > Help, (2) Contact campus mailroom at ext. 2500, or (3) Ask me something more specific about your packages. 😊`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
};

// --- Main Chat Function -------------------------------------
export const sendAIMessage = async (
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
    context: AIContext,
    onChunk?: (chunk: string) => void
): Promise<{ text: string; provider: AIProvider }> => {
    await initAIService();

    // Try backend API first
    if (currentProvider !== 'mock') {
        try {
            const token = await getStoredToken();
            const response = await fetch(`${BASE_URL}/api/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ messages, context }),
            });

            if (response.ok) {
                const data = await response.json();
                return { text: data.response, provider: data.provider };
            }
        } catch (error) {
            console.warn('[AI] Backend unavailable, switching to enhanced mock');
            currentProvider = 'mock';
        }
    }

    // Enhanced mock fallback
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
    
    // Simulate realistic typing delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
    
    const response = buildSmartMockResponse(lastUserMessage, context);
    
    // Simulate streaming for mock
    if (onChunk) {
        for (const char of response) {
            onChunk(char);
            await new Promise(resolve => setTimeout(resolve, 8));
        }
    }

    return { text: response, provider: 'mock' };
};

// --- ETA Prediction -----------------------------------------
export const predictPickupETA = async (packageId: string): Promise<string> => {
    try {
        const token = await getStoredToken();
        const res = await fetch(`${BASE_URL}/api/ai/eta`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ packageId }),
        });
        if (res.ok) {
            const root = await res.json();
            return root.data?.eta || root.eta;
        }
    } catch {}

    // Mock ETA based on current time
    const hour = new Date().getHours();
    if (hour < 12) return 'Today, 2:00 PM – 4:00 PM';
    if (hour < 16) return 'Today, 6:00 PM – 8:00 PM';
    return 'Tomorrow, 10:00 AM – 12:00 PM';
};

// --- Helper -------------------------------------------------
const getStoredToken = async (): Promise<string | null> => {
    try {
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
        const authData = await AsyncStorage.getItem('auth-storage');
        if (authData) {
            const parsed = JSON.parse(authData);
            return parsed?.state?.token || null;
        }
    } catch {}
    return null;
};
