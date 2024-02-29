import { Request, Response } from "express";

//@desc logut
//@method GET  /auth/logout
//@access public
export const logout = async (req: Request, res: Response) => {
    const Jwt = req.cookies?.Jwt;
    if (!Jwt) return res.status(204).json({ message: "wasnt there", success: true });
    res.cookie("Jwt", "");
    res.json({ message: "Cookie cleared", success: true });
};
