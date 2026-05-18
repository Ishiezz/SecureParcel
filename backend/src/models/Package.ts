import mongoose, { Schema, Document, Model } from 'mongoose';

export type PackageStatus = 'pending' | 'stored' | 'verified' | 'collected' | 'expired';

export interface IPackage extends Document {
    packageId: string;
    studentId: string;
    studentName: string;
    deliveryAgentId?: string;
    courier: string;
    slot: string;
    status: PackageStatus;
    otp: string;
    otpHash?: string;
    dynamicQrSeed: string;
    photoUrl?: string;
    estimatedPickupTime?: Date;
    guardId?: string;
    guardName?: string;
    createdAt: Date;
    collectedAt?: Date;
    verifiedAt?: Date;
    expiresAt: Date;
    isExpired: boolean;
}

const PackageSchema = new Schema<IPackage>(
    {
        packageId: { type: String, required: true, unique: true, index: true },
        studentId: { type: String, required: true, index: true },
        studentName: { type: String, required: true },
        deliveryAgentId: { type: String },
        courier: { type: String, required: true, trim: true },
        slot: { type: String, required: true, uppercase: true },
        status: {
            type: String,
            enum: ['pending', 'stored', 'verified', 'collected', 'expired'],
            default: 'stored',
            index: true,
        },
        otp: { type: String, required: true, select: false },
        otpHash: { type: String, select: false },
        dynamicQrSeed: { type: String, required: true },
        photoUrl: { type: String },
        estimatedPickupTime: { type: Date },
        guardId: { type: String },
        guardName: { type: String },
        collectedAt: { type: Date },
        verifiedAt: { type: Date },
        expiresAt: {
            type: Date,
            required: true,
            default: () => {
                const d = new Date();
                d.setDate(d.getDate() + 7);
                return d;
            },
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

PackageSchema.virtual('isExpired').get(function () {
    return this.expiresAt < new Date() && this.status !== 'collected';
});

// Compound indexes
PackageSchema.index({ status: 1, slot: 1 });
PackageSchema.index({ studentId: 1, status: 1 });
PackageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL for cleanup

export const Package: Model<IPackage> = mongoose.model<IPackage>('Package', PackageSchema);
