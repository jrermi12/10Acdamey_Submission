import asyncHandler from 'express-async-handler';
import { Response } from "express";
import { IUserMessage } from '../../middleware/authJWT';
import NotFoundError from '../../errors/notFound.errors';
import { z } from 'zod';
import userModel from '../../model/user.model';
import { deleteUserSchema } from '../../utils/validation/user.validation';


//@desc delete business
//@method DELETE  /users/:id
//@access private
export const deleteUser = asyncHandler(async (req: IUserMessage<z.TypeOf<typeof deleteUserSchema>["params"], {}, {}>, res: Response) => {
    const existingUser = await userModel.findById(req.params.id)
    if (!existingUser) throw new NotFoundError("User not found")
    const deleteBusiness = await userModel.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: "User deleted sucessfully" });
})