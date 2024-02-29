import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
// import IExhibitor from "../interfaces/exhibitor.interace";
import AttendantModel from "../model/attendant.model";
import associatedexhibitorsModel from "../model/associatedexhibitors.model";
import SessionModel from "../model/session.model"
export async function getAllAteendants() {
    const attendant = await AttendantModel.find({ isPresent: true });
    const associate = await associatedexhibitorsModel.find({ isPresent: true });
    return [...attendant, ...associate]
}

export async function findAttendantsById(id: string) {
    return await AttendantModel.findById(id);
}

export async function findSpecialById(id: string) {
    const attendi = await AttendantModel.findById(id);
    const associate = await associatedexhibitorsModel.findById(id)
    return attendi ?? associate
}


export async function getAllSessions() {
    const sessions = await SessionModel.find();

    return sessions
}

export async function findSessionsById(id: string) {
    return await SessionModel.find({ attendeId: id }).sort({ createdAt: -1 })
}


// export async function findExhibitorByName(name: string) {
//     const exhibitors = await ExhibitorModel.find();
//     const response =  exhibitors.find((exhibitor) => exhibitor.companyInformation.companyName === name);
//     return response
// }

// export async function createExhibitor(exhibitorData: Partial<IExhibitor>) {
//     try {
//         const result = await ExhibitorModel.create(exhibitorData);
//         return {
//             data: result,
//             success: true
//         };
//     } catch (error) {
//         return {
//             data: null,
//             success: false
//         };
//     }
// }

// export async function deleteExhibitorById(id: string) {
//     return await ExhibitorModel.deleteOne({ _id: id });
// }

// export async function findByIdAndUpdateExhibitor(
//     query: string,
//     update: UpdateQuery<IExhibitor>,
//     options?: QueryOptions
// ) {
//     try {
//         const result = await ExhibitorModel.findByIdAndUpdate(query, update, options);
//         return { data: result, success: true };
//     } catch (error) {
//         return { data: null, success: false };
//     }
// }
