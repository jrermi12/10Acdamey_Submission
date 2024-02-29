import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import ExhibitorModel from '../../model/exhibitor.model';
import { getExhibitorInput, } from '../../utils/validation/exhibitor.validation';
import { getAllExhibitors, findExhibitorById, findExhibitorByName } from "../../services/exhibitor.service"
import { findAttendByCompanyName, findAttendantByExhibitorId } from '../../services/asscoiatedExhbitor.service';
// import {findAttendantByExhibitorId } from "../../services/asscoiatedExhbitor.service"

import NotFoundError from '../../errors/notFound.errors';
// Get Exhibitor
export const getExhibitor = asyncHandler(async (req: Request<getExhibitorInput>, res: Response) => {
    const queryParams = req.query as {search:string}
    const query: Record<string, any> = {};
    if (queryParams.search) {
        query['companyInformation.companyName'] = { $regex: new RegExp(queryParams.search, 'i') };
    }
    const response = await getAllExhibitors(query);
    if (!response) {
        throw new NotFoundError('Exhibitor not found');
    }
    res.status(200).json(response);
});


export const getExhibitorById = asyncHandler(async (req: Request<getExhibitorInput>, res: Response) => {
    const { id } = req.params
    const response = await findExhibitorById(id);
    if (!response) {
        throw new NotFoundError('Exhibitor not found');
    }
    res.status(200).json(response);
});


export const getAssociatedByExhibitorId = asyncHandler(async (req: Request<getExhibitorInput>, res: Response) => {
    const { id } = req.params
    const response = await findAttendantByExhibitorId(id);
    if (!response) {
        throw new NotFoundError('assocates not found');
    }
    res.status(200).json(response);
});


export const checkExhibitor = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const attendant = await findAttendByCompanyName(id);
    if (!attendant) {
        throw new NotFoundError('Exhibitor not found');
    }
    res.status(200).json(attendant);
});



