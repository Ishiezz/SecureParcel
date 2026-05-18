import { Router, Response, Request } from 'express';
import { Locker } from '../models/Locker';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/lockers — Get all lockers
router.get('/', authenticate, async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const lockers = await Locker.find().sort({ zone: 1, lockerId: 1 });
        res.json({ success: true, data: lockers });
    } catch (err: any) {
        res.status(500).json({ success: false, error: { message: err.message } });
    }
});

// GET /api/lockers/available — Get available lockers
router.get('/available', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { size } = req.query;
        let query: any = { status: 'available' };
        if (size) query.size = size;

        const lockers = await Locker.find(query).sort({ zone: 1, lockerId: 1 });
        res.json({ success: true, data: lockers });
    } catch (err: any) {
        res.status(500).json({ success: false, error: { message: err.message } });
    }
});

// PUT /api/lockers/:id/maintenance — Toggle maintenance (Admin/Guard)
router.put('/:id/maintenance', authenticate, requireRole('guard', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'available' or 'maintenance'

        if (!['available', 'maintenance'].includes(status)) {
            res.status(400).json({ success: false, error: { message: 'Invalid status' } });
            return;
        }

        const locker = await Locker.findOneAndUpdate(
            { lockerId: id },
            { status, lastMaintenanceAt: status === 'maintenance' ? new Date() : undefined },
            { new: true }
        );

        if (!locker) {
            res.status(404).json({ success: false, error: { message: 'Locker not found' } });
            return;
        }

        res.json({ success: true, data: locker });
    } catch (err: any) {
        res.status(500).json({ success: false, error: { message: err.message } });
    }
});

// POST /api/lockers/init — Initialize lockers (Admin only - for testing/setup)
router.post('/init', async (req: Request, res: Response): Promise<void> => {
    try {
        // Clear existing lockers
        await Locker.deleteMany({});

        const defaultLockers = [
            { lockerId: 'A-01', zone: 'A', size: 'S', status: 'available' },
            { lockerId: 'A-02', zone: 'A', size: 'S', status: 'available' },
            { lockerId: 'A-03', zone: 'A', size: 'M', status: 'available' },
            { lockerId: 'A-04', zone: 'A', size: 'L', status: 'available' },
            { lockerId: 'B-01', zone: 'B', size: 'S', status: 'available' },
            { lockerId: 'B-02', zone: 'B', size: 'M', status: 'available' },
            { lockerId: 'B-03', zone: 'B', size: 'L', status: 'available' },
            { lockerId: 'C-01', zone: 'C', size: 'M', status: 'available' },
            { lockerId: 'C-02', zone: 'C', size: 'XL', status: 'available' },
        ];

        await Locker.insertMany(defaultLockers);
        res.status(201).json({ success: true, message: 'Lockers initialized' });
    } catch (err: any) {
        res.status(500).json({ success: false, error: { message: err.message } });
    }
});

export default router;
