import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import IAttendant from "../interfaces/associatedExhibitor.interface";
import AssociatedExhibitor from "../model/associatedexhibitors.model";
import Exhibitor from "../model/exhibitor.model"
export async function getAllAttendants() {
    return await AssociatedExhibitor.find();
}

export async function findAttendByCompanyName(id: string) {
    const exhibitor = await Exhibitor.findById(id)
    const repesentativeInfo = exhibitor?.representativeInformation
    console.log(exhibitor?.companyInformation?.companyName)
    const associated = await AssociatedExhibitor.find({
        companyName: { $regex: new RegExp(exhibitor?.companyInformation?.companyName, 'i') }
    })

    const fullDelegate = exhibitor?.fullDelegate

    const data = {
        badge: fullDelegate,
        repesentativeInfo: repesentativeInfo,
        associated: associated
    }
    return data
}


export async function findAttendantById(id: string) {
    return await AssociatedExhibitor.findById(id);
}


export async function findAttendantByExhibitorId(id: string) {
    return await AssociatedExhibitor.find({ companyName: id });
}



export async function createAttendant(attendantData: Partial<IAttendant>) {
    try {
        const result = await AssociatedExhibitor.create(attendantData);
        return {
            data: result,
            success: true
        };
    } catch (error) {
        return {
            data: null,
            success: false
        };
    }
}

export async function deleteAttendantById(id: string) {
    return await AssociatedExhibitor.deleteOne({ _id: id });
}



export async function findByIdAndUpdateAttendant(
    query: string,
    update: UpdateQuery<IAttendant>,
    options?: QueryOptions
) {
    try {
        const result = await AssociatedExhibitor.findByIdAndUpdate(query, update, options);
        return { data: result, success: true };
    } catch (error) {
        return { data: null, success: false };
    }
}
