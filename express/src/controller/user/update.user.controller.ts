import asyncHandler from "express-async-handler";
import userModel from "../../model/user.model";
import { Response } from "express";

import { IUserMessage } from "../../middleware/authJWT";
import NotFoundError from "../../errors/notFound.errors";
import { updateUserInput, updateUserSchema } from "../../utils/validation/user.validation";
import { z } from "zod";


//@desc  update user
//@method PATCH  /users/:id
//@access protected
export const updateUser = asyncHandler(async (req: IUserMessage<z.TypeOf<typeof updateUserSchema>["params"], {}, updateUserInput>, res: Response) => {
    const user = userModel.findById(req.params.id)
    if (!user) throw new NotFoundError('User not found')
    const updatedUser = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json({
        message: "User updated successfully",
        data: updatedUser,
        success: true
    });
})