
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import AttendantModel from '../../model/associatedexhibitors.model';
import {
   
    updateAttendantInput
} from '../../utils/validation/attendant.validation';
import NotFoundError from '../../errors/notFound.errors';
// Update Attendant
export const updateAttendant = asyncHandler(async (req: Request<updateAttendantInput>, res: Response) => {
    const response = await AttendantModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!response) {
        throw new NotFoundError('Attendant not found');
    }
    res.status(200).json({
        message: 'Attendant updated successfully',
        data: response,
        success: true
    });
});