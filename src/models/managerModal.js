import mongoose, { Schema } from 'mongoose';

// Manager schema
const managerSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/\S+@\S+\.\S+/, 'Please provide a valid email address.'],
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: 'manager',
        },
        managedUsers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
        }],
    },
    { timestamps: true }
);

export const Manager = mongoose.model('Manager', managerSchema);
