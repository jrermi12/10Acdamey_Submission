import { Request, Response } from "express";
import { resetPasswordInput } from "../../utils/validation/auth.validation";
import userModel from "../../model/user.model";
import bcrypt from 'bcrypt'
import BadRequestError from "../../errors/badRequest.errors";
import asyncHandler from "express-async-handler";



//@desc reset password
//@method POST  /auth/resetPassword
//@access public
export const resetPasswordHandler = asyncHandler(async (req: Request<{}, {}, resetPasswordInput>, res: Response) => {
    const { email, passwordResetCode, password } = req.body;

    const user = await userModel.findOne({ email }).select("+passwordResetCode +verificationCodeExpires");

    if (
        !user ||
        !user.passwordResetCode ||
        user.passwordResetCode !== passwordResetCode ||
        user.verificationCodeExpires < Date.now()
    ) {
        throw new BadRequestError('Could not reset user password')
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    user.password = hashPassword;
    user.passwordResetCode = null;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully', sccuses: true });
}

) 