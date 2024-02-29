import asyncHandler from "express-async-handler";
import userModel from "../../model/user.model";
import { changePasswordInput } from "../../utils/validation/auth.validation";
import { Response } from "express";
import bcrypt from 'bcrypt'

import { IUserMessage } from "../../middleware/authJWT";
import ForbiddenError from "../../errors/forbidden.errors";
import { findUserByEmail } from  "../../services/auth.service";


//@desc  change password of first time loggedin user
//@method PATCH  /auth/change
//@access protected
export const changePassword = asyncHandler(async (req: IUserMessage<{}, {}, changePasswordInput>, res: Response) => {
    const { email, password } = req.body;
    const userId = req?.userData.userId
    const user = await findUserByEmail(email);

    if (!user || user._id.toString() != userId) throw new ForbiddenError("Unauthorised to change password");

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    user.password = hashPassword;
    user.firstTimeLogin = false;
    await user.save();
    res.status(200).json({ message: "Password change successfully", success: true });
})