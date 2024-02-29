import asyncHandler from "express-async-handler";
import ForbiddenError from "../../errors/forbidden.errors";
import UnAuthenticatedError from "../../errors/unauthenticatedError";
import userModel from "../../model/user.model";
import { signJwt } from "../../utils/jwt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

//@desc token refreshh
//@method POST  /auth/refresh
//@access public
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
    // const Jwt = req.cookies?.Jwt;
    const Jwt = req.body?.Jwt
    if (!Jwt) throw new UnAuthenticatedError("Must provide token ");
    jwt.verify(Jwt, process.env.JWT_REFRESH_SECRET as string, async (err: any, decode: Record<string, any>) => {
        if (err) throw new ForbiddenError("Forbidden");
        const { userId } = decode;
        const userExist = await userModel.findById(userId);
        if (!userExist) throw new UnAuthenticatedError("Unauthorized");
        const toBeSignedData = {
            userId: userExist._id,
            role: userExist.role,
        }
        const accessToken = signJwt(
            toBeSignedData,
            process.env.JWT_ACCESS_SECRET as string,
            {
                expiresIn: "15m"
            })
        const refreshToken = signJwt(
            toBeSignedData,
            process.env.JWT_REFRESH_SECRET as string,
            {
                expiresIn: "7d"
            })

        res.status(200).json({
            data: {
                accessToken,
                refreshToken
            }, success: true
        });
    });
})