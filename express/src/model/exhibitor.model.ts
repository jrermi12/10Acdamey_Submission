import mongoose, { Schema, model } from "mongoose";

import { PAYMENT_STATUS } from "./badge.model";
import IExhibitor from "../interfaces/exhibitor.interace";

export enum boothType {
    REGULAR = "REGULAR", PREMIUM = "PREMIUM", TRIPLE = "TRIPLE", UNKNOWN = "UNKNOWN"
}

const exhibitorSchema = new Schema<IExhibitor>({
    exhibitorId: {
        type: String
    },
    boothType: {
        type: String,
        enum: boothType,
    },
    paymentStatus: {
        type: String,
        enum: PAYMENT_STATUS,
        default: PAYMENT_STATUS.PAID
    },

    fullDelegate: {
        type: Number,
        default: 0
    },

    companyInformation: {
        companyName: {
            type: String,
            //required: [true, 'you need to provide company name!']
        },
        country: {
            type: String
        },
    },
    representativeInformation: {
        firstName: {
            type: String,
            //required: [true, 'first name is //required']
        },
        lastName: {
            type: String,
            //required: [true, 'last name is //required']
        },
        email: {
            type: String,
            validate: {
                validator: () => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test)
            },
            //required: [true, 'email is //required'],
        },
        phoneNumber: {
            type: String,
            //required: [true, 'phone number is //required'],
        },
    },

}, { timestamps: true });

export default model<IExhibitor>("Exhibitor", exhibitorSchema);
