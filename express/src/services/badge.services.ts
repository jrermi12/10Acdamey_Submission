import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import IBadge from "../interfaces/badge.interface";
import BadgeModel from "../model/badge.model";

export async function getAllBadge() {
    return await BadgeModel.find().sort({ createdAt: -1 }).populate(["attendantInformation", "associatedInformation"])
}

export async function findBadgeById(id: string) {
    return await BadgeModel.findById(id).populate(["attendantInformation", "associatedInformation"])
}

export async function findBadgeByEmail(email: string) {
    return await BadgeModel.findOne({ email: email })
}




// export async function findBadge(
//     query: FilterQuery<IBadge>,
//     options: QueryOptions = { lean: true }
// ): Promise<IBadge | null> {

//     const result = await BadgeModel.findOne(query, {}, options);
//     return result

// }
export async function createBadge(BadgeData: Partial<IBadge>) {
    try {
        const result = BadgeModel.create(BadgeData)
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
    return await BadgeModel.deleteOne({ _id: id })
}

export async function findByIdAndUpdate(
    query: string,
    update: UpdateQuery<IBadge>,
    options?: QueryOptions
) {
    try {
        const result = BadgeModel.findByIdAndUpdate(query, update, options)
        return { data: result, sucess: true }
    } catch (error) {
        return { data: null, sucess: false }
    }
}

