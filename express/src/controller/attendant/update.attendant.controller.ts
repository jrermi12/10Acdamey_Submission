import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import NotFoundError from '../../errors/notFound.errors';
import attendantModel from '../../model/attendant.model';
import associatedexhibitorsModel from '../../model/associatedexhibitors.model';
import { updateAttendantInput, updateAttendantSchema } from '../../utils/validation/attendant.validation';
import { TypeOf } from 'zod';

// Update Attendant
export const updateAttendant = asyncHandler(async (req: Request<updateAttendantInput, {}, TypeOf<typeof updateAttendantSchema>["body"]>, res: Response) => {
    const body = { ...req.body }
    const { id } = req.params
    const exhibitorId = body?.exhibitorId
    const Position = body?.Position
    let response;
    if (!exhibitorId) {
        response = await attendantModel.findByIdAndUpdate(id, { companyInformation: { ...body.companyInformation, Position }, attendeeInformation: body.attendeeInformation }, { new: true });
        if (!response) {
            throw new NotFoundError('Attedant not found');
        }
    } else {
        response = await associatedexhibitorsModel.findByIdAndUpdate(id, {  attendeeInformation: { ...body.attendeeInformation, Position } }, { new: true });
        if (!response) {
            throw new NotFoundError('Attedant not found');
        }
    }

    res.status(200).json({
        message: 'Attendant updated successfully',
        data: response,
        success: true
    });
});

