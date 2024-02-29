import { Document } from "mongoose";
import { boothType } from "../model/exhibitor.model";
import { PAYMENT_STATUS } from "../model/badge.model";

interface ICompanyInformation {
    companyName: string;
    country?: string;
    
}

interface IAttendeeInformation {
    fullName: string;
    email: string;
    phoneNumber: string;
}




interface IExhibitor extends Document {
    exhibitorId: string,
    boothType: boothType,
    paymentStatus: PAYMENT_STATUS
    companyInformation: ICompanyInformation;
    fullDelegate:  number,
    representativeInformation: IAttendeeInformation;

}

export default IExhibitor;
