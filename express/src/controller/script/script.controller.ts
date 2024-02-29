import fs from 'fs';
import AssociatedModel from "../../model/associatedexhibitors.model";
import BadgeModel, { IBadge } from "../../model/badge.model";
import AttendantModel from "../../model/attendant.model";
import sessionModel from "../../model/session.model";
import userModel from "../../model/badge.model";
import asyncHandler from "express-async-handler"
import { Request, Response } from 'express';
import IAttendant from "../../interfaces/attendant.interface"
import IAssociatedExhibitor from "../../interfaces/associatedExhibitor.interface"
type IbadgeNew = IBadge & {
    attendantInformation: IAttendant,
    associatedInformation: IAssociatedExhibitor
}


function datandtime(specifiedDateTime) {
    const specifiedDate = new Date(specifiedDateTime);

    const year = specifiedDate.getFullYear();
    const month = specifiedDate.getMonth();
    const day = specifiedDate.getDate();
    const hour = specifiedDate.getHours();
    const minute = specifiedDate.getMinutes();
    const second = specifiedDate.getSeconds();
    const millisecond = specifiedDate.getMilliseconds();

    const startOfDay = new Date(year, month, day, hour, minute, second, millisecond);

    const endOfDay = new Date(year, month, day, 23, 59, 59, 999);

    console.log("startOfDay", startOfDay);
    console.log("endOfDay", endOfDay);

    return {
        startOfDay,
        endOfDay
    }

    // Call your function to delete attendees within this time range
    // deleteAttendeesInRange(startOfDay, endOfDay);
}



export const getPresent = async (req: Request, res: Response) => {
    const specifiedDateTime = ""
    const result = datandtime(specifiedDateTime)
    const present = await sessionModel.find({
        "scannedPostitions": "Entrance",
        createdAt: {
            $gte: result.startOfDay, 
            $lte: result.endOfDay 
        }
    });
    console.log("present", present)
    const uniqueAttendeeIds = [];
    for (const session of present) {
        uniqueAttendeeIds.push(session._id);
    }
    res.status(200).json({
        uniqueAttendeeIds: uniqueAttendeeIds,
        uniqueAttendeeIdsCount: uniqueAttendeeIds.length
    });
}

export const getBagCollection = async (req: Request, res: Response) => {
    const Bagcollections = await sessionModel.find({ scannedPostitions: "Bag collection" })
    const uniqueAttendeeIds = [];
    for (const session of Bagcollections) {
        uniqueAttendeeIds.push(session.attendeId);
    }

    res.status(200).json({
        uniqueAttendeeIds: uniqueAttendeeIds,
        uniqueAttendeeIdsCount: uniqueAttendeeIds.length
    });
}



export const getLunchLength = async (req: Request, res: Response) => {
    const specifiedDateTime = ""
    const result = datandtime(specifiedDateTime)
    const lunch = await sessionModel.find({
        scannedPostitions: "Lunch",
        createdAt: {
            $gte: result.startOfDay, // Match documents with createdAt greater than or equal to the beginning of yesterday
            $lte: result.endOfDay // Match documents with createdAt less than or equal to the end of yesterday
        }
    });
    const uniqueAttendeeIds = [];
    for (const session of lunch) {
        if (!uniqueAttendeeIds.includes(session.attendeId)) {
            uniqueAttendeeIds.push(session.attendeId);
        }
    }
    res.status(200).json({
        uniqueAttendeeIds: uniqueAttendeeIds,
        uniqueAttendeeIdsCount: uniqueAttendeeIds.length
    });
}


export const getIWCABreakfast = async (req: Request, res: Response) => {
    const specifiedDateTime = ""
    const result = datandtime(specifiedDateTime)

    const lunch = await sessionModel.find({
        scannedPostitions: "IWCA Breakfast",
        createdAt: {
            $gte: result.startOfDay, // Match documents with createdAt greater than or equal to the beginning of yesterday
            $lte: result.endOfDay // Match documents with createdAt less than or equal to the end of yesterday
        }
    });
    const uniqueAttendeeIds = [];
    for (const session of lunch) {
        if (!uniqueAttendeeIds.includes(session.attendeId)) {
            uniqueAttendeeIds.push(session.attendeId);
        }
    }
    res.status(200).json({
        uniqueAttendeeIds: uniqueAttendeeIds,
        uniqueAttendeeIdsCount: uniqueAttendeeIds.length
    });
}
export const getSnumber = asyncHandler(async (req: Request, res: Response) => {
    try {
        // Fetch all badges
        const badges: IBadge[] = await BadgeModel.find();

        // Array to hold the IDs of badges with Sustainability Day
        const badgesWithSustainabilityDay: string[] = [];

        // Iterate through each badge
        for (const badge of badges) {
            // Check if "Sustainability Day" is in the sideActivity array
            if (badge.sideActivity.includes("Sustainability Day")) {
                badgesWithSustainabilityDay.push(badge._id.toString()); // Push ID to array
            }
        }

        // Send the length of the array as a response
        res.status(200).json({ count: badgesWithSustainabilityDay.length, badgeIds: badgesWithSustainabilityDay });
    } catch (error) {
        console.error("Error occurred while checking Sustainability Day:", error);
        // Send error response
        res.status(500).json({ error: "Internal Server Error" });
    }
})

export const getSuststanblity = asyncHandler(async (req: Request, res: Response) => {
    const specifiedDateTime = ""
    const result = datandtime(specifiedDateTime)
    const sessions = await sessionModel.find({
        scannedPostitions: "AxumHall",
        createdAt: {
            $gte: result.startOfDay, // Match documents with createdAt greater than or equal to the beginning of the specified date
            $lte: result.endOfDay // Match documents with createdAt less than or equal to the end of the specified date
        }
    });
    const uniqueAttendeeIds = [];
    for (const session of sessions) {
        if (!uniqueAttendeeIds.includes(session.attendeId)) {
            uniqueAttendeeIds.push(session.attendeId);
        }
    }
    res.status(200).json({
        uniqueAttendeeIds: uniqueAttendeeIds,
        uniqueAttendeeIdsCount: uniqueAttendeeIds.length
    });
});


export const getMeeting = asyncHandler(async (req: Request, res: Response) => {
    const startDate = new Date("2024-02-07T09:00:00.000Z");
    const endDate = new Date("2024-02-07T13:00:00.000Z");


    const sessions = await sessionModel.find({

        // createdAt: {
        //     $gte: startDate,
        //     $lte: endDate
        // },
        scannedPostitions: "Meeting Room 2"
        // $nin: ["Entrance", "Lunch","Bag collection","Lalibella","Meeting Room 3","AXUM Hall"]
        // }
    });

    const uniqueAttendeeIds = [];
    for (const session of sessions) {
        if (!uniqueAttendeeIds.includes(session.attendeId)) {
            uniqueAttendeeIds.push(session?.attendeId);
        }
    }

    res.status(200).json({
        uniqueAttendeeIds: uniqueAttendeeIds,
        uniqueAttendeeIdsCount: uniqueAttendeeIds.length
    });
});


export const getFarmersDay = asyncHandler(async (req: Request, res: Response) => {
    const startDate = new Date("2024-02-08");
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date("2024-02-08");
    endDate.setHours(23, 59, 59, 999); 

    const sessions = await sessionModel.find({
        scannedPostitions: "AXUM Hall",
         createdAt: {
            $gte: startDate,
            $lte: endDate
        },
    });

    const uniqueAttendeeIds = [];
    for (const session of sessions) {
        if (!uniqueAttendeeIds.includes(session.attendeId)) {
            uniqueAttendeeIds.push(session);
        }
    }

    res.status(200).json({
        uniqueAttendeeIds: uniqueAttendeeIds,
        uniqueAttendeeIdsCount: uniqueAttendeeIds.length
    });
});
