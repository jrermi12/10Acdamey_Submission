import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { IMembership } from "../interfaces/membership.interface";
import MembershipModel from "../model/membership.model";

export async function getAllMembership() {
    return await MembershipModel.find()
}

export async function findMembershipById(id: string) {
    return await MembershipModel.findById(id)
}

export async function findMembershipByEmail(email: string) {
    return await MembershipModel.findOne({ email: email })
}




export async function findMembership(
    query: FilterQuery<IMembership>,
    options: QueryOptions = { lean: true }
): Promise<IMembership | null> {

    const result = await MembershipModel.findOne(query, {}, options);
    return result

}

export async function createMembership(MembershipData: Partial<IMembership>) {
    try {
        const result = MembershipModel.create(MembershipData)
        return {
            data: result, sucess: true
        }
    } catch (error) {
        return {
            data: null, sucess: false
        }
    }

}

export async function deleteById(id: string) {
    return await MembershipModel.deleteOne({ _id: id })
}

export async function findByIdAndUpdate(
    query: string,
    update: UpdateQuery<IMembership>,
    options?: QueryOptions
) {
    try {
        const result = MembershipModel.findByIdAndUpdate(query, update, options)
        return { data: result, sucess: true }
    } catch (error) {
        return { data: null, sucess: false }
    }
}
