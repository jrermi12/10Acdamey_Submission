// import { NextFunction, Request, Response } from "express";

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import UnAuthenticatedError from "../errors/unauthenticatedError";
import ForbiddenError from "../errors/forbidden.errors";



export interface UserDataType {

  userId: string;
  role: string
}
export interface IUserMessage<TParams = any, TQuery = any, TBody = any> extends Request<TParams, TQuery, TBody> {
  userData: UserDataType;
}
export const AuthJWT =
  (
    req: IUserMessage,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader = req.headers.authorization || req.headers.Authorization as string;
      if (!authHeader?.startsWith("Bearer ")) {
        throw new UnAuthenticatedError("Unauthorized");
      }
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
        if (err) throw new ForbiddenError("Forbidden");
        req.userData = decoded as UserDataType;
        next();
      });

    } catch (err) {
      return res.status(403).json({
        message: "unauthorized",
      });
    }
  };




