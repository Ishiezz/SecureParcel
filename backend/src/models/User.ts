import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
    uid: string;
    role: 'student' | 'delivery' | 'guard' | 'admin';
    id: string;
    name: string;
    email: string;
    password?: string;
    department?: string;
    phone?: string;
    avatarUrl?: string;
    pushToken?: string;
    premiumTier: 'free' | 'premium';
    biometricEnabled: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    comparePassword(password: string): Promise<boolean>;
    generateAuthToken(): string;
}

const UserSchema = new Schema<IUser>(
    {
        uid: { type: String, required: true, unique: true, index: true },
        role: { type: String, enum: ['student', 'delivery', 'guard', 'admin'], required: true },
        id: { type: String, required: true, unique: true, index: true },
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, select: false },
        department: { type: String, trim: true },
        phone: { type: String, trim: true },
        avatarUrl: { type: String },
        pushToken: { type: String },
        premiumTier: { type: String, enum: ['free', 'premium'], default: 'free' },
        biometricEnabled: { type: Boolean, default: true },
        lastLoginAt: { type: Date },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Hash password before save
UserSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) return;
    this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAuthToken = function (): string {
    return jwt.sign(
        { uid: this.uid, role: this.role, id: this.id },
        process.env.JWT_SECRET || 'secureparcel-dev-secret-key-change-in-prod',
        { expiresIn: '7d' }
    );
};

// Indexes
UserSchema.index({ role: 1 });
UserSchema.index({ email: 1, role: 1 });

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
