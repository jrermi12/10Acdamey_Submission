import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import AttendantModel from '../../model/associatedexhibitors.model';
import {
   
    getAttendantInput,
   
} from '../../utils/validation/attendant.validation';
import NotFoundError from '../../errors/notFound.errors';
import {getAllAttendants, findAttendantById, findAttendByCompanyName } from "../../services/asscoiatedExhbitor.service"

export const getAllAttendantsHandler = asyncHandler(async (req: Request<getAttendantInput>, res: Response) => {
    const response = await getAllAttendants();
    if (!response) {
        throw new NotFoundError('Attendant not found');
    }
    res.status(200).json({
        data: response,
        success: true
    });
});

export const getAttendantByIdHandler = asyncHandler(async (req: Request<getAttendantInput>, res: Response) => {
    const { id } = req.params;
    const response = await findAttendantById(id);
    if (!response) {
        throw new NotFoundError('Attendant not found');
    }
    res.status(200).json(response) 
});

export const getAssociatedAttendantsByExhibitorIdHandler = asyncHandler(async (req: Request<getAttendantInput>, res: Response) => {
    const { name } = req.params;
    const response = await findAttendByCompanyName(name);
    if (!response) {
        throw new NotFoundError('Attendant not found');
    }
    res.status(200).json(response) 
});
