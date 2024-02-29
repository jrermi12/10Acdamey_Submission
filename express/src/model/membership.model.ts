import mongoose, { Schema, model } from "mongoose";
import { IMembership } from "../interfaces/membership.interface";


export enum MEMBERSHIP_TYPE {
    ANNUAL = "annual",
    TERM = "term"
}
const membershipSchema = new Schema<IMembership>({
    membershipId: {
        type: String
    },
    attendeeInformation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attendant"
    },
    membershipTye: {
        type: String,
        enum: MEMBERSHIP_TYPE,
        default: MEMBERSHIP_TYPE.ANNUAL
    }
}, { timestamps: true });

export default model<IMembership>("Membership", membershipSchema);
