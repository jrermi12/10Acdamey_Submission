import mongoose, { Schema, model } from "mongoose";
import sessionInterface from "../interfaces/session.interface"
const SessionSchema = new Schema<sessionInterface>({
        attendeId: {
            type: mongoose.Schema.Types.ObjectId
        }, 
        createdAt: {
            type: Date,
            default: Date.now
        },
        scannedPostitions: {
            type: String,
        }, 
        scannedPostitionType: {
            type: String,
        }, 
}, { timestamps: true });

export default model<sessionInterface>("session", SessionSchema);
