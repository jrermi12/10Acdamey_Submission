import { Document, ObjectId } from 'mongoose';
import Role, { STANDING_POSITION, STANDING_POSITION_TYPE} from '../config/roles';

interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    role: Role
    isActive?: boolean;
    passwordResetCode?: string;
    verificationCode: string;
    verificationCodeExpires?: number;
    firstTimeLogin?: boolean;
    standingPosition?: STANDING_POSITION
    standingPositionType?:STANDING_POSITION_TYPE
}

export default IUser;
