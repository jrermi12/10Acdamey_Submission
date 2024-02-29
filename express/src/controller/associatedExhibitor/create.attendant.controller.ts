import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import AttendantModel from '../../model/associatedexhibitors.model';
import IAssociatedExhibitor from '../../interfaces/associatedExhibitor.interface';
import { createAttendant } from "../../services/asscoiatedExhbitor.service"
import { findExhibitorById } from '../../services/exhibitor.service';
import {
    createAttendantInput,

} from '../../utils/validation/attendant.validation';
import NotFoundError from '../../errors/notFound.errors';
import { badgeType } from "../../config/roles";


// Create Attendant
export const createAttendantsHandler = asyncHandler(async (req: Request<{}, {}, createAttendantInput>, res: Response) => {
    const body = { ...req.body } as IAssociatedExhibitor
    const { id }: any = req.params
    const exhibitor = await findExhibitorById(id);
    if (!exhibitor) throw new NotFoundError('Exhibitor not found');
    body.exhibitorId = exhibitor._id;
    let availablity;

    let response;
    if (body.badgeType === "fullDelegate") {
        availablity = exhibitor.fullDelegate
        if (availablity > 0) {
            exhibitor.fullDelegate = availablity - 1
            await exhibitor.save()
            response = await createAttendant(body);
        } else {
            res.status(400).json({
                message: 'No more fullDelegate badges available, since allowed amount is already used',
                success: false
            })
        }
    }
    

    if (!response) throw new NotFoundError('Attendant not created');
    res.status(201).json({
        message: 'Attendant created successfully',
        data: response,
        success: true
    });
});

