import mongoose, { Schema, model } from "mongoose";
import IAttendant from "../interfaces/associatedExhibitor.interface";

const attendantSchema = new Schema<IAttendant>({
    attendeeInformation: {
        fullName: {
            type: String,
            required: [true, 'full name is required']
        },
        nationality: {
            type: String,
            required: [true, 'nationality is required']
        },
        email: {
            type: String,
            validate: {
                validator: () => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test)
            },
            required: [true, 'email is required'],
        },
        phoneNumber: {
            type: String,
            required: [true, 'phone number is required'],
        },
        Position: {
            type: String,
            // required: [true, 'position is required']
        },

    },
    badgeType: {
        type: String,
        // required: [true, 'badge type is required']
    },
    exhibitorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exhibitor'
    },
    companyName: {
        type: String,
        // required: [true, 'company name is required']
    },
    country: {
        type: String,
        // required: [true, 'company name is required']
    },
    isPresent: {
        type: Boolean,
        default: false
    },
    daysPresent: {
        type: Number,
        default: 0
    },

}, { timestamps: true });

export default model<IAttendant>("Associated", attendantSchema);
