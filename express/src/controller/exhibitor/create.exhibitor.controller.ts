import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import ExhibitorModel from '../../model/exhibitor.model';
import NotFoundError from '../../errors/notFound.errors';
import { parseCSVExhibitorData } from "./parse.exhibitor";
import { createExhibitorInput } from '../../utils/validation/exhibitor.validation';

// Create Exhibitor
export const createExhibitorsHandler = asyncHandler(async (req: Request<{}, {}, createExhibitorInput>, res: Response) => {
    try {
        let parsedData;

        // Check if there is a file upload
        if (req.file && req.file) {
            const csvData = req.file.buffer.toString();
            // Call the parseCSVExhibitorData function
            parsedData = parseCSVExhibitorData(csvData);

        } else if (req.body && Array.isArray(req.body)) {
            // If data is directly sent in the request body
            parsedData = req.body;
        } else {
            throw new Error("Invalid request format. Please provide either a CSV file or data in the request body.");
        }
        // console.log("parsedData", parsedData);

        const responseData = await Promise.all(parsedData.map(async (data) => {
            const { boothType, companyInformation, representativeInformation } = data;

            let boothTypeUpperCase;

            if (!boothType || boothType.trim() === "") {
                console.error("Invalid boothType:", boothType);
                boothTypeUpperCase = "UNKNOWN";
            } else {
                // boothTypeUperCase = boothType.trim("\r");
                boothTypeUpperCase = boothType.replace("\r","").toUpperCase();
            }

            let savedExhibitor;
            let fullDelegate;
            // Create exhibitor based on boothType (case-insensitive)
            if (boothTypeUpperCase === "REGULAR") {
                fullDelegate = 2
            } else if (boothTypeUpperCase === "PREMIUM") {

                fullDelegate = 4
            } else if (boothTypeUpperCase === "TRIPLE") {
                fullDelegate = 6
            } else {
                // Default case, set to UNKNOWN
                fullDelegate = 0
            }


            const exhibitor = new ExhibitorModel({
                companyInformation: companyInformation,
                fullDelegate: fullDelegate, // Make sure this line is correct
                boothType: boothTypeUpperCase,
                representativeInformation: representativeInformation
            });


            savedExhibitor = await exhibitor.save();
            // console.log(`Saved ${boothTypeUpperCase} Exhibitor:`, savedExhibitor);


            if (!savedExhibitor) {
                throw new NotFoundError('Exhibitor not found');
            }

            return savedExhibitor;
        }));

        // Return the response data
        res.status(201).json({
            success: true,
            message: "Exhibitors created successfully",
            data: responseData,
        });
    } catch (error) {
        // Handle any unexpected errors during exhibitor creation
        console.error("Error during exhibitor creation:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
