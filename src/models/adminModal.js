import mongoose, { Schema } from 'mongoose';

const adminSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/\S+@\S+\.\S+/, 'Please provide a valid email address.']
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: "admin",
        },
    },
    {
        timestamps: true
    }
);

adminSchema.index({ username: 1 }, { unique: true });
adminSchema.index({ email: 1 }, { unique: true });

export const Admin = mongoose.model('Admin', adminSchema);

