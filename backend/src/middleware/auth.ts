import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifyFirebaseToken } from '../config/firebaseAdmin';

export interface AuthRequest extends Request {
    user?: {
        uid: string;
        role: string;
        id?: string;
        email?: string;
    };
}

const JWT_SECRET = process.env.JWT_SECRET || 'secureparcel-dev-secret-key-change-in-prod';

export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        // In dev mode, allow mock tokens
        if (process.env.NODE_ENV !== 'production' && authHeader === 'Bearer mock-token') {
            req.user = { uid: 'mock-uid', role: 'student', id: 'STU001', email: 'demo@campus.edu' };
            return next();
        }
        res.status(401).json({ success: false, error: { message: 'No token provided', code: 'UNAUTHORIZED' } });
        return;
    }

    const token = authHeader.split(' ')[1];

    // 1. Try Firebase token verification
    const decoded = await verifyFirebaseToken(token);
    if (decoded) {
        req.user = {
            uid: decoded.uid,
            role: decoded.role as string || 'student',
            email: decoded.email,
        };
        return next();
    }

    // 2. Try JWT verification
    try {
        const payload = jwt.verify(token, JWT_SECRET) as any;
        req.user = { uid: payload.uid, role: payload.role, id: payload.id };
        return next();
    } catch {}

    // 3. Dev fallback
    if (process.env.NODE_ENV !== 'production') {
        console.warn('[Auth] Token verification failed — dev fallback applied');
        req.user = { uid: 'dev-uid', role: 'student', id: 'DEV001' };
        return next();
    }

    res.status(401).json({ success: false, error: { message: 'Invalid or expired token', code: 'UNAUTHORIZED' } });
};

export const requireRole = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                error: { message: `Access denied. Required role: ${roles.join(' or ')}`, code: 'FORBIDDEN' },
            });
            return;
        }
        next();
    };
};
