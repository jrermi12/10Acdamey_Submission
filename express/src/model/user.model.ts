import mongoose, { Schema, model } from "mongoose";
import IUser from "../interfaces/user.interface";
import Role, { STANDING_POSITION } from "../config/roles";


const userSchema = new Schema<IUser>({
    firstName: {
        type: String,
        required: [true, 'first name is required']
    },
    lastName: {
        type: String,
        required: [true, 'last name is required']
    },
    email: {
        type: String,
        validate: {
            validator: () => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test)
        },
        required: [true, 'email is required'],
    },
    password: {
        type: String,
        select: false,
        minLength: [6, 'password should have atleast 6 charachters']
    },
    phoneNumber: {
        type: String,
        required: [true, 'phone number is required'],
    },
    role: {
        type: String,
        // enum: Role,
        // default: Role.REGISTRAR,
    },
    standingPosition: {
        type: String,
        // enum: STANDING_POSITION,
        // default: STANDING_POSITION.entry,
    },
    standingPositionType: {
        type: String,
        // enum: STANDING_POSITION,
        // default: STANDING_POSITION.entry,
    },
    isActive: {
        type: Boolean,
        default: false
    },
    passwordResetCode: {
        type: String,
        select: false
    },
    verificationCode: {
        type: String,
        select: false
    },
    verificationCodeExpires: {
        type: Number,
        select: false
    },
    firstTimeLogin: {
        type: Boolean,
        default: true
    },

}, { timestamps: true });

export default model<IUser>("User", userSchema);
