import { Document } from "mongoose";


interface IAttendantInformation {
    fullName: string;
    nationality: string;
    email: string;
    phoneNumber: string;
}

interface IcompanyInformation {
    companyName: string,
    country: string,
    city: string,
    Position: string
}
interface IAttendant extends Document {
    companyInformation: IcompanyInformation
    attendeeInformation: IAttendantInformation;
    isPresent: boolean
    daysPresent: number
}
export default IAttendant;
