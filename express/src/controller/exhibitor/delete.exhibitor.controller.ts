import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import ExhibitorModel from '../../model/exhibitor.model';
import {
    deleteExhibitorInput,
} from '../../utils/validation/exhibitor.validation';
import NotFoundError from '../../errors/notFound.errors';
import BadgeModel from '../../model/badge.model';

// Delete Exhibitor
export const deleteExhibitor = asyncHandler(async (req: Request<deleteExhibitorInput>, res: Response) => {
    const response = await ExhibitorModel.findByIdAndDelete(req.params.id);
    if (!response) {
        throw new NotFoundError('Exhibitor not found');
    }
    res.status(200).json({
        message: 'Exhibitor deleted successfully',
        success: true
    });
});



export const deleteEx = asyncHandler(async (req: Request, res: Response) => {
    const response = await BadgeModel.find({ badgeType: "Exhibitor" }).deleteMany();
    if (!response) {
        throw new NotFoundError('Exhibitors not found');
    }
    res.status(200).json({
        message: 'Exhibitors badge deleted successfully',
        success: true
    });
});

