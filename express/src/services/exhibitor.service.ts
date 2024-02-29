import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import IExhibitor from "../interfaces/exhibitor.interace";
import ExhibitorModel from "../model/exhibitor.model";
import associatedexhibitorsModel from "../model/associatedexhibitors.model";

export async function getAllExhibitors(query: FilterQuery<IExhibitor>) {
    return await ExhibitorModel.find(query);
}

export async function findExhibitorById(id: string) {
    return await ExhibitorModel.findById(id);
}
export async function findExhibitorByIdForSingle(id: string) {
    const ex = await ExhibitorModel.findById(id);
    const attendant = await associatedexhibitorsModel.find({ companyName: ex?.companyInformation?.companyName })
    return { exhibitor: ex, attendant }
}


export async function findExhibitorByName(name: string) {
    const exhibitors = await ExhibitorModel.find();
    const response = exhibitors.find((exhibitor) => exhibitor.companyInformation.companyName === name);
    return response
}

export async function createExhibitor(exhibitorData: Partial<IExhibitor>) {
    try {
        const result = await ExhibitorModel.create(exhibitorData);
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

export async function deleteExhibitorById(id: string) {
    return await ExhibitorModel.deleteOne({ _id: id });
}

export async function findByIdAndUpdateExhibitor(
    query: string,
    update: UpdateQuery<IExhibitor>,
    options?: QueryOptions
) {
    try {
        const result = await ExhibitorModel.findByIdAndUpdate(query, update, options);
        return { data: result, success: true };
    } catch (error) {
        return { data: null, success: false };
    }
}
