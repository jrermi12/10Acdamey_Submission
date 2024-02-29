
import { Response, NextFunction } from "express"
import { IUserMessage, UserDataType } from "../middleware/authJWT";
import userModel from "../model/user.model";
import Role from "../config/roles";


export const isSuperAdmin = async (req: IUserMessage, res: Response, next: NextFunction) => {
    const { userId, role } = req.userData as UserDataType;
    const user = await userModel.findOne({ _id: userId })
    if (!user) {
        return res.status(403)
            .json({
                message: "Invalid JWT token",
                success: false
            });
    }
    if (role === Role.SUPER_ADMIN) {
        res.status(200)
        next();
    } else {
        res.status(403)
            .json({
                message: "Unauthorized access",
                success: false
            });
    }
}

export const isRegistree = async (req: IUserMessage, res: Response, next: NextFunction) => {
    const { userId, role } = req.userData as UserDataType;
    const user = await userModel.findOne({ _id: userId })
    if (!user) {
        return res.status(403)
            .json({
                message: "Invalid JWT token",
                success: false
            });
    }
    if (role === Role.REGISTRAR) {
        res.status(200)
        next();
    } else {
        res.status(403)
            .json({
                message: "Unauthorized access",
                success: false
            });
    }
}

export const isRegistreeOrSuperAdmin = async (req: IUserMessage, res: Response, next: NextFunction) => {
    const { userId, role } = req.userData as UserDataType;
    const user = await userModel.findOne({ _id: userId })
    if (!user) {
        return res.status(403)
            .json({
                message: "Invalid JWT token",
                success: false
            });
    }
    if (role === Role.REGISTRAR || role === Role.SUPER_ADMIN) {
        res.status(200)
        next();
    } else {
        res.status(403)
            .json({
                message: "Unauthorized access",
                success: false
            });
    }
}
