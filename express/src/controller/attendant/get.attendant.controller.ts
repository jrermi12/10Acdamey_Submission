import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {getAllAteendants, findAttendantsById, findSessionsById, findSpecialById } from "../../services/attendent.services"
import NotFoundError from '../../errors/notFound.errors';


export const getAllAteendantsHandler = asyncHandler(async (req: Request, res: Response) => {
    const response = await getAllAteendants();
    if (!response) {
        throw new NotFoundError('Attendants not found');
    }
    res.status(200).json(response)
});

export const getSessionsByIdHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await findSessionsById(id);
    if (!response) {
        throw new NotFoundError('session not found');
    }
    res.status(200).json(response) 
});



export const getAllSessionsHandler = asyncHandler(async (req: Request, res: Response) => {
    const response = await getAllAteendants();
    if (!response) {
        throw new NotFoundError('Attendants not found');
    }
    res.status(200).json(response)
});

export const getAteendantsByIdHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await findSpecialById(id);
    if (!response) {
        throw new NotFoundError('Attendant not found');
    }
    res.status(200).json(response) 
});

// export const getAssociatedAttendantsByExhibitorIdHandler = asyncHandler(async (req: Request<getAttendantInput>, res: Response) => {
//     const { name } = req.params;
//     const response = await findAttendByCompanyName(name);
//     if (!response) {
//         throw new NotFoundError('Attendant not found');
//     }
//     res.status(200).json(response) 
// });
