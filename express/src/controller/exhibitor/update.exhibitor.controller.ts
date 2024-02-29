import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import ExhibitorModel from '../../model/exhibitor.model';

import IExhibitor  from "../../interfaces/exhibitor.interace"
import {
  
    updateExhibitorInput
} from '../../utils/validation/exhibitor.validation';
import NotFoundError from '../../errors/notFound.errors';

// Update Exhibitor
export const updateExhibitor = asyncHandler(async (req: Request<updateExhibitorInput>, res: Response) => {
    const body = { ...req.body } as IExhibitor
    const { id } = req.params
    const response = await ExhibitorModel.findByIdAndUpdate(id, body, { new: true });
    if (!response) {
        throw new NotFoundError('Exhibitor not found');
    }
    res.status(200).json({
        message: 'Exhibitor updated successfully',
        data: response,
        success: true
    });
});

