import { Document } from "mongoose";


interface sessionInterface {
    attendeId: Object,
    createdAt: Date,
    scannedPostitions: string,
    scannedPostitionType: string,
   
}

// interface IcompanyInformation {
//     companyName: string,
//     country: string,
//     city: string,
//     Position: string
// }
// interface IAttendant extends Document {
//     companyInformation: IcompanyInformation
//     attendeeInformation: IAttendantInformation;
//     isPresent: boolean
//     daysPresent: number
// }
export default sessionInterface;
