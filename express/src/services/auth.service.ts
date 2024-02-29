import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import IUser from "../interfaces/user.interface";
import UserModel from "../model/user.model";

export async function getAllUser() {
    return await UserModel.find({ role: { $in: ['REGISTRAR', "SCANNER"] } }).sort({ createdAt: -1 })
}


export async function findUserById(id: string) {
    return await UserModel.findById(id)
}

export async function findUserByEmail(email: string) {
    return await UserModel.findOne({ email: email })
}


export async function findUser(
    query: FilterQuery<IUser>,
    options: QueryOptions = { lean: true }
): Promise<IUser | null> {

    const result = await UserModel.findOne(query, {}, options);
    return result

}
export async function createUser(userData: Partial<IUser>) {
    try {
        const result = UserModel.create(userData)
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
    return await UserModel.deleteOne({ _id: id })
}

export async function findByIdAndUpdate(
    query: string,
    update: UpdateQuery<IUser>,
    options?: QueryOptions
) {
    try {
        const result = UserModel.findByIdAndUpdate(query, update, options)
        return { data: result, sucess: true }
    } catch (error) {
        return { data: null, sucess: false }
    }
}