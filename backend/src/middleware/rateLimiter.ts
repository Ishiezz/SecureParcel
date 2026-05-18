import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// General API rate limiter
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: { message: 'Too many requests. Please wait 15 minutes.', code: 'RATE_LIMITED' } },
});

// Auth endpoints
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: { success: false, error: { message: 'Too many login attempts. Please wait.', code: 'RATE_LIMITED' } },
});

// AI endpoint
export const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20,
    message: { success: false, error: { message: 'AI rate limit reached. Please wait a moment.', code: 'RATE_LIMITED' } },
});

// Error handler middleware
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    console.error('[Error]', err.stack || err.message);

    // Handle specific error types
    if (err.name === 'ValidationError') {
        res.status(400).json({
            success: false,
            error: { message: 'Validation failed', code: 'VALIDATION_ERROR', details: err.message },
        });
        return;
    }

    if (err.name === 'CastError') {
        res.status(400).json({ success: false, error: { message: 'Invalid ID format', code: 'INVALID_ID' } });
        return;
    }

    if ((err as any).code === 11000) {
        res.status(409).json({ success: false, error: { message: 'Resource already exists', code: 'DUPLICATE' } });
        return;
    }

    res.status(500).json({
        success: false,
        error: {
            message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
            code: 'INTERNAL_ERROR',
        },
    });
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(404).json({
        success: false,
        error: { message: `Route ${req.method} ${req.path} not found`, code: 'NOT_FOUND' },
    });
};
