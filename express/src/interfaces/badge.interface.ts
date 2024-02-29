import mongoose,{ Document, ObjectId } from "mongoose";
import { SIDE_ACTIVITY, PAYMENT_STATUS, SELECTED_DATE, VERIFICATION } from "../model/badge.model";
import { badgeType } from "../config/roles";

interface IVerification {
    lunch: VERIFICATION;
    bag_collection: VERIFICATION;
}
interface IBadge extends Document {
    _id: ObjectId;
    badgeType: badgeType;
    associatedInformation: {
        _id: mongoose.Schema.Types.ObjectId; // Add this line
        // other properties
    };
    attendantInformation: {
        _id: mongoose.Schema.Types.ObjectId; // Add this line
        // other properties
    };
    verification: IVerification;
    seletedDays: SELECTED_DATE[];
    sideActivity: SIDE_ACTIVITY[];
    paymentStatus: PAYMENT_STATUS,
    price: number;
    isMember: boolean
}



export default IBadge;
