import { Router, Response, Request } from 'express';
import { Package } from '../models/Package';
import { Locker } from '../models/Locker';
import { User } from '../models/User';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { getSocketServer } from '../services/socketService';
import { sendFCMNotification } from '../config/firebaseAdmin';

const router = Router();

// GET /api/packages — Get packages based on role
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { role, uid, id } = req.user!;
        let query: any = {};

        if (role === 'student') {
            query.studentId = id;
        } else if (role === 'guard') {
            query.status = 'stored'; // Guards see all active packages
        } else if (role === 'delivery') {
            query.deliveryAgentId = uid;
        }

        const packages = await Package.find(query).sort({ createdAt: -1 });
        res.json({ success: true, data: packages });
    } catch (err: any) {
        res.status(500).json({ success: false, error: { message: err.message } });
    }
});

// POST /api/packages — Create a new package (Delivery Agent)
router.post('/', authenticate, requireRole('delivery', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { studentId, studentName, courier, slot, photoUrl } = req.body;

        if (!studentId || !studentName || !courier || !slot) {
            res.status(400).json({ success: false, error: { message: 'Missing required fields' } });
            return;
        }

        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const packageId = `PKG-${Math.floor(100000 + Math.random() * 900000)}`;
        const dynamicQrSeed = `QR_SEED_${packageId}_${Date.now()}`;

        const pkg = new Package({
            packageId,
            studentId: studentId.toUpperCase(),
            studentName,
            deliveryAgentId: req.user!.uid,
            courier,
            slot: slot.toUpperCase(),
            status: 'stored',
            otp,
            dynamicQrSeed,
            photoUrl,
        });

        await pkg.save();

        // Update locker status
        await Locker.findOneAndUpdate(
            { lockerId: slot.toUpperCase() },
            { status: 'occupied', currentPackageId: packageId, $inc: { totalUsageCount: 1 } }
        );

        // Emit socket event
        const io = getSocketServer();
        if (io) io.emit('package:deposited', pkg);

        // Send push notification to student
        const student = await User.findOne({ id: studentId.toUpperCase() });
        if (student && student.pushToken) {
            await sendFCMNotification(
                student.pushToken,
                '📦 Package Arrived!',
                `Your ${courier} package has been deposited in locker slot ${slot.toUpperCase()}.`,
                { packageId }
            );
        }

        res.status(201).json({ success: true, data: pkg });
    } catch (err: any) {
        res.status(500).json({ success: false, error: { message: err.message } });
    }
});

// PUT /api/packages/:id/collect — Guard collects package
router.put('/:id/collect', authenticate, requireRole('guard', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { guardName } = req.body;

        const pkg = await Package.findOne({ packageId: id });
        if (!pkg) {
            res.status(404).json({ success: false, error: { message: 'Package not found' } });
            return;
        }

        if (pkg.status === 'collected') {
            res.status(400).json({ success: false, error: { message: 'Package already collected' } });
            return;
        }

        pkg.status = 'collected';
        pkg.collectedAt = new Date();
        pkg.guardId = req.user!.uid;
        pkg.guardName = guardName || 'Duty Guard';
        await pkg.save();

        // Free the locker
        await Locker.findOneAndUpdate(
            { lockerId: pkg.slot },
            { status: 'available', currentPackageId: null }
        );

        // Emit socket event
        const io = getSocketServer();
        if (io) io.emit('package:collected', pkg);

        // Send push notification to student
        const student = await User.findOne({ id: pkg.studentId });
        if (student && student.pushToken) {
            await sendFCMNotification(
                student.pushToken,
                '✅ Package Collected',
                `Your package from slot ${pkg.slot} was successfully handed over.`,
                { packageId: id as string }
            );
        }

        res.json({ success: true, data: pkg });
    } catch (err: any) {
        res.status(500).json({ success: false, error: { message: err.message } });
    }
});

export default router;
