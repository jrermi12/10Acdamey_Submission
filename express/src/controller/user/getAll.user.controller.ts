import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import userModel from '../../model/user.model';
import { getUsersInput } from '../../utils/validation/user.validation';
import { getAllUser } from '../../services/auth.service';


//@desc get all users
//@method GET  /users
//@access private
// const getAllUsers

//     = asyncHandler(async (req: Request, res: Response) => {
//         const queryParams: getUsersInput = req.query
//         const page = queryParams.page ? parseInt(queryParams.page, 10) : 1;
//         const limit = queryParams.limit ? parseInt(queryParams.limit, 10) : 10;
//         const skip = (page - 1) * limit;

//         const query: Record<string, any> = {};

//         if (queryParams.search) {
//             query.firstName = { $regex: new RegExp(queryParams.search, 'i') };
//         }
//         if (queryParams.businessId) {
//             query.businessId = queryParams.businessId
//         }
//         console.log({ query })

//         const items = await userModel.find(query)
//             .sort({ [queryParams.sortBy || 'createdAt']: queryParams.sortOrder === 'desc' ? -1 : 1 })
//             .skip(skip)
//             .limit(limit)
//             .exec();
//         const totalItems = await userModel.countDocuments(query);
//         res.json({
//             success: true,
//             data: items,
//             pageInfo: {
//                 page,
//                 limit,
//                 totalItems,
//                 totalPages: Math.ceil(totalItems / limit),
//             },
//         })
//     })

const getAllUsers = asyncHandler(async (req: Request, res: Response) => { 

    const users = await getAllUser();
    if (!users) {
        res.status(404);
        throw new Error('No users found');
    }
    res.json(users)
})


const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.json(user)
})



export {
    getAllUsers, 
    getUserById

};
