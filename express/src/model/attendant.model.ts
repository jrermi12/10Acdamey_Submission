import mongoose, { Schema, model } from "mongoose";
import IAttendant from "../interfaces/attendant.interface";

const attendantSchema = new Schema<IAttendant>({
    companyInformation: {
        companyName: {
            type: String,
            // required: [true, 'you need to provide company name!']
        },
        country: {
            type: String
        },
        city: {
            type: String
        },
        Position: {
            type: String
        }
    },
    attendeeInformation: {
        fullName: {
            type: String,
            // required: [true, 'full name is required']
        },

        nationality: {
            type: String,
            // required: [true, 'nationality is required']
        },
        email: {
            type: String,
            validate: {
                validator: () => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test)
            },
            // required: [true, 'email is required'],
        },
        phoneNumber: {
            type: String,
            // required: [true, 'phone number is required'],
        },
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

export default model<IAttendant>("Attendant", attendantSchema);
