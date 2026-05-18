import { Router, Response } from 'express';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { chat, getProviderStatus } from '../services/aiService';
import { aiLimiter } from '../middleware/rateLimiter';

const router = Router();

// GET /api/ai/providers — Check which AI providers are active
router.get('/providers', (_req, res: Response) => {
    res.json({ success: true, data: getProviderStatus() });
});

// POST /api/ai/chat — Main chat endpoint
router.post('/chat', aiLimiter, authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { messages, context } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            res.status(400).json({ success: false, error: { message: 'messages array is required', code: 'VALIDATION' } });
            return;
        }

        // Build context string
        let contextString = '';
        if (context) {
            if (context.activePackages?.length > 0) {
                contextString += `User has ${context.activePackages.length} active package(s): `;
                contextString += context.activePackages.map((p: any) =>
                    `${p.courier} in slot ${p.slot} (status: ${p.status})`
                ).join(', ') + '. ';
            }
            if (context.userName) contextString += `User name: ${context.userName}. `;
            if (context.studentId) contextString += `Student ID: ${context.studentId}.`;
        }

        const { text, provider } = await chat(messages, contextString || undefined);

        res.json({ success: true, response: text, provider });
    } catch (err: any) {
        console.error('[AI Route] Error:', err.message);
        res.status(500).json({
            success: false,
            error: { message: 'AI service temporarily unavailable', code: 'AI_ERROR' },
            fallback: 'Please try again shortly.',
        });
    }
});

// POST /api/ai/eta — Predict package pickup ETA
router.post('/eta', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { packageId } = req.body;

        // Mock ETA prediction based on time of day + historical patterns
        const hour = new Date().getHours();
        let eta: string;
        if (hour < 9) eta = 'Today, 12:00 PM – 2:00 PM';
        else if (hour < 12) eta = 'Today, 3:00 PM – 5:00 PM';
        else if (hour < 15) eta = 'Today, 6:00 PM – 8:00 PM';
        else if (hour < 18) eta = 'Today, 8:00 PM – 10:00 PM';
        else eta = 'Tomorrow, 10:00 AM – 12:00 PM';

        res.json({ success: true, data: { packageId, eta, confidence: 0.87 } });
    } catch (err: any) {
        res.status(500).json({ success: false, error: { message: err.message } });
    }
});

export default router;
