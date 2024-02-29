import { Request, Response } from "express";
import { registerUserInput } from "../../utils/validation/auth.validation";
import BadRequestError from "../../errors/badRequest.errors";
import bcrypt from 'bcrypt'
import { generateRandom4DigitString } from "../../utils/util";
import { sendMail } from "../../utils/sendMail";
import asyncHandler from 'express-async-handler';
import { createUser, findUserByEmail } from "../../services/auth.service";
import Role, { STANDING_POSITION } from '../../config/roles';

//@desc signup
//@method POST  /auth/signup
//@access public
export const registerUser = asyncHandler(async (req: Request<object, object, registerUserInput>, res: Response) => {
    const { email, password } = req.body
    const userExists = await findUserByEmail(email)

    if (userExists) throw new BadRequestError('User exists with this credential')
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const code = generateRandom4DigitString()
    const verificationExpires = parseInt(process.env.VERIFICATION_CODE_EXP ?? "30") * 1000 * 60
    const response = await createUser({
        ...req.body,
        password: hashPassword,
        role: Role.SUPER_ADMIN,
        verificationCode: code,
        verificationCodeExpires: Date.now() + verificationExpires,
    })

    await sendMail({
        email: email,
        subject: "Email verification",
        template: "emailVerification.mails.ejs",
        data: {
            user: req.body.firstName,
            code,
        },
    });
    res.status(201).json({ success: true, message: 'Verification email sent', email: email})


}) 