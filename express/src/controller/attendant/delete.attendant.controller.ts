import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
    deleteExhibitorInput,
} from '../../utils/validation/exhibitor.validation';
import NotFoundError from '../../errors/notFound.errors';
import attendantModel from '../../model/attendant.model';
import associatedexhibitorsModel from '../../model/associatedexhibitors.model';

// Delete Exhibitor
export const deleteAttendant = asyncHandler(async (req: Request<deleteExhibitorInput>, res: Response) => {
    const attendant = await attendantModel.findById(req.params.id)
    if (attendant) await attendant.deleteOne()
    const associate = await associatedexhibitorsModel.findById(req.params.id)
    if (associate) await associate.deleteOne()
    if (!attendant || !associate) {
        throw new NotFoundError('Attendant not found');
    }
    res.status(200).json({
        message: 'Exhibitor deleted successfully',
        success: true
    });
});

