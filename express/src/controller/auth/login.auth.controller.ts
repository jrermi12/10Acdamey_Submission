import { Request, Response } from "express";
import { loginUserInput } from "../../utils/validation/auth.validation";
import userModel from "../../model/user.model";
import BadRequestError from "../../errors/badRequest.errors";
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt'
import UnAuthenticatedError from "../../errors/unauthenticatedError";
import { signJwt } from "../../utils/jwt";
import { findUser } from "../../services/auth.service";
import NotFoundError from "../../errors/notFound.errors";


//@desc  login user
//@method POST  /auth/login
//@access public
export const login = asyncHandler(async (req: Request<{}, {}, loginUserInput>, res: Response) => {
    const { email, password } = req.body
    const userExist = await findUser({ email }, { select: "+password", lean: true })

    if (!userExist) throw new NotFoundError('User doesnt exist')
    if (!userExist.isActive) throw new BadRequestError('verify your email first')
    const match = await bcrypt.compare(password, userExist.password);
    if (!match) throw new BadRequestError("Invalid credential");


    const toBeSignedData = {
        userId: userExist._id,
        role: userExist.role,
    }

    const accessToken = signJwt(
        toBeSignedData,
        process.env.JWT_ACCESS_SECRET as string,
        {
            expiresIn: "3d"
        })
    const refreshToken = signJwt(
        toBeSignedData,
        process.env.JWT_REFRESH_SECRET as string,
        {
            expiresIn: "7d"
        })


    delete userExist.password;
    res.cookie("Jwt", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000 * 7,
    });
    res.status(201).json({
        success: true, data: {
            user: userExist,
            accessToken,
            refreshToken
        }
    })

}) 