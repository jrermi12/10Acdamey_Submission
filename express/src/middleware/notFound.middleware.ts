import { Response, Request } from "express";
export default (req: Request, res: Response) => {
    return res.status(404).json({ message: "page not found", success: false });
};
