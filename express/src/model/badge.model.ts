import mongoose, { Schema, model, Document } from "mongoose";
import { badgeType } from "../config/roles";

export enum PAYMENT_STATUS {
    PAID = "PAID",
    UNPAID = "UNPAID"
}

export enum VERIFICATION {
    VALID = 'VALID',
    UNVALID = 'UNVALID',
    USED = 'USED'
}

export enum SELECTED_DATE {
    DAY1 = "08/02/2024",
    DAY2 = "09/02/2024",
    DAY3 = "10/02/2024"
}

export enum SIDE_ACTIVITY {
    sideActivity1 = "Sustainability Day",
    sideActivity2 = "B2B Cupping Table",
    sideActivity3 = "B2B Cupping Room",
    sideActivity4 = "2-day/1-night safaris Kerchanshe Trading Debeka Coffee Safari",
    sideActivity5 = "Horra Trading Processing Facility",
    sideActivity6 = "Social events",
    sideActivity7 = "Workshop: New Frontiers in Post-Harvest Processing with CQI"
}

interface IVerification {
    lunch: {
        eatNumber: number,
        lastEat: Date
    };
    bag_collection: {
        bagCollectionNumber: number
        lastBagCollection: Date
    };
    lastEntrance: Date,
    lastSocailEvent: Date
}

export interface IBadge extends Document {
    badgeType: string;
    paymentStatus: PAYMENT_STATUS;
    associatedInformation: {
        _id: mongoose.Schema.Types.ObjectId; // Add this line
        // other properties
    };
    attendantInformation: {
        _id: mongoose.Schema.Types.ObjectId; // Add this line
        // other properties
    };
    verification: IVerification;
    selectedDays: SELECTED_DATE[];
    sideActivity: string[];
    isMember: boolean;
    price: number;
    daysPresent?: number
}

const badgeSchema = new Schema<IBadge>({
    badgeType: {
        type: String,
        // enum: Object.values(badgeType),
        // default: badgeType.One_day_Badge
    },
    paymentStatus: {
        type: String,
        enum: Object.values(PAYMENT_STATUS),
        default: PAYMENT_STATUS.UNPAID
    },
    associatedInformation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Associated"
    },
    attendantInformation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attendant"
    },
    isMember: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default: 0
    },
    daysPresent: {
        type: Number,
        default: 0
    },
    verification: {
        lunch: {
            eatNumber: {
                type: Number,
                default: 0
            },
            lastEat: Date
        },
        bag_collection: {
            bagCollectionNumber: {
                type: Number,
                default: 0
            },
            lastBagCollection: Date
        },
        lastEntrance: Date,
        lastSocailEvent: Date
    },
    selectedDays: [
        {
            type: String,
            // enum: Object.values(SELECTED_DATE),
            // default: SELECTED_DATE.DAY1
        }
    ],
    sideActivity: [
        {
            type: String,
            // enum: Object.values(SIDE_ACTIVITY),
            // default: SIDE_ACTIVITY.sideActivity1
        }
    ],

}, { timestamps: true });

export default model<IBadge>("Badge", badgeSchema);
