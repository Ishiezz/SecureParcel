import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILocker extends Document {
    lockerId: string;
    zone: 'A' | 'B' | 'C';
    size: 'S' | 'M' | 'L' | 'XL';
    status: 'available' | 'reserved' | 'occupied' | 'maintenance';
    currentPackageId?: string;
    temperature?: number;
    lastMaintenanceAt?: Date;
    totalUsageCount: number;
}

const LockerSchema = new Schema<ILocker>(
    {
        lockerId: { type: String, required: true, unique: true, index: true },
        zone: { type: String, enum: ['A', 'B', 'C'], required: true },
        size: { type: String, enum: ['S', 'M', 'L', 'XL'], required: true },
        status: {
            type: String,
            enum: ['available', 'reserved', 'occupied', 'maintenance'],
            default: 'available',
            index: true,
        },
        currentPackageId: { type: String, default: null },
        temperature: { type: Number },
        lastMaintenanceAt: { type: Date },
        totalUsageCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

LockerSchema.index({ status: 1, size: 1 });
LockerSchema.index({ zone: 1, status: 1 });

export const Locker: Model<ILocker> = mongoose.model<ILocker>('Locker', LockerSchema);
