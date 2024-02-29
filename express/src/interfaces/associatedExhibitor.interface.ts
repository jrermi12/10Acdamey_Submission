import { Document } from "mongoose";


interface IAssociatedExhibitorInformation {
    fullName: string;
    nationality: string;
    email: string;
    phoneNumber: string;
    Position: string,

}

interface IAssociatedExhibitor extends Document {
    attendeeInformation: IAssociatedExhibitorInformation;
    badgeType: string;
    exhibitorId: Object;
    companyName: string;
    country: string;
    isPresent: boolean,
    daysPresent: number
}
export default IAssociatedExhibitor;
