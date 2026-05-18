import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// POST /api/auth/register — Create user
router.post('/register', authLimiter, async (req: Request, res: Response): Promise<void> => {
    try {
        const { uid, role, id, name, email, department, phone } = req.body;

        if (!uid || !role || !id || !name || !email) {
            res.status(400).json({ success: false, error: { message: 'Missing required fields' } });
            return;
        }

        const existingUser = await User.findOne({ $or: [{ uid }, { email }, { id }] });
        if (existingUser) {
            res.status(409).json({ success: false, error: { message: 'User already exists' } });
            return;
        }

        const user = new User({
            uid,
            role,
            id,
            name,
            email,
            department,
            phone,
            premiumTier: 'free',
        });

        await user.save();
        const token = user.generateAuthToken();

        res.status(201).json({ success: true, token, user });
    } catch (err: any) {
        res.status(500).json({ success: false, error: { message: err.message } });
    }
});

// POST /api/auth/login — Login/verify user
router.post('/login', authLimiter, async (req: Request, res: Response): Promise<void> => {
    try {
        const { uid, email } = req.body;

        if (!uid || !email) {
            res.status(400).json({ success: false, error: { message: 'uid and email required' } });
            return;
        }

        let user = await User.findOne({ uid });

        // Auto-create user if they don't exist but logged in via Firebase
        if (!user) {
            user = new User({
                uid,
                role: 'student', // Default role
                id: email.split('@')[0].toUpperCase(),
                name: email.split('@')[0],
                email,
                premiumTier: 'free',
            });
            await user.save();
        }

        user.lastLoginAt = new Date();
        await user.save();

        const token = user.generateAuthToken();

        res.json({ success: true, token, user });
    } catch (err: any) {
        res.status(500).json({ success: false, error: { message: err.message } });
    }
});

// GET /api/auth/profile — Get current user profile
router.get('/profile', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findOne({ uid: req.user?.uid });
        if (!user) {
            res.status(404).json({ success: false, error: { message: 'User not found' } });
            return;
        }
        res.json({ success: true, user });
    } catch (err: any) {
        res.status(500).json({ success: false, error: { message: err.message } });
    }
});

// PUT /api/auth/profile — Update profile
router.put('/profile', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, department, phone, avatarUrl, pushToken, biometricEnabled, premiumTier } = req.body;
        
        const updateData: any = {};
        if (name) updateData.name = name;
        if (department) updateData.department = department;
        if (phone) updateData.phone = phone;
        if (avatarUrl) updateData.avatarUrl = avatarUrl;
        if (pushToken) updateData.pushToken = pushToken;
        if (biometricEnabled !== undefined) updateData.biometricEnabled = biometricEnabled;
        if (premiumTier) updateData.premiumTier = premiumTier; // Should normally be verified via RevenueCat webhook

        const user = await User.findOneAndUpdate(
            { uid: req.user?.uid },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!user) {
            res.status(404).json({ success: false, error: { message: 'User not found' } });
            return;
        }

        res.json({ success: true, user });
    } catch (err: any) {
        res.status(500).json({ success: false, error: { message: err.message } });
    }
});

export default router;
