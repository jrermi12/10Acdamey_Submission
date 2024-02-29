
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import AttendantModel from '../../model/associatedexhibitors.model';
import {
 
    deleteAttendantInput,

} from '../../utils/validation/attendant.validation';
import NotFoundError from '../../errors/notFound.errors';
// Delete Attendant
export const deleteAttendant = asyncHandler(async (req: Request<deleteAttendantInput>, res: Response) => {
    const response = await AttendantModel.findByIdAndDelete(req.params.id);
    if (!response) {
        throw new NotFoundError('Attendant not found');
    }
    res.status(200).json({
        message: 'Attendant deleted successfully',
        success: true
    });
});

