import { MEMBERSHIP_TYPE } from "../model/membership.model"
import IAttendant from "./attendant.interface"

export interface IMembership {
    membershipId?: string,
    attendeeInformation: IAttendant["_id"],
    membershipTye: MEMBERSHIP_TYPE

}
