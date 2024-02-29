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


// Function to parse side activities based on the CSV header
const parseSideActivities = (sideActivities) => {
    const sideActivitiesCSV = {
        'Sustainability_Day': sideActivities.includes('Sustainability Day Meeting') ? 'Yes' : 'No',
        'Farmers_Day': sideActivities.includes('Farmers Day') ? 'Yes' : 'No',
        'Social_events': sideActivities.includes('Social events') ? 'Yes' : 'No',
        'Workshop_Risk_Management': sideActivities.includes('Workshop: Risk Management Understanding Futures & Options by Judith Ganes') ? 'Yes' : 'No',
        'Workshop_New_Frontiers': sideActivities.includes('Workshop: New Frontiers in Post-Harvest Processing with CQI') ? 'Yes' : 'No',
        'IWCA_Breakfast': sideActivities.includes('IWCA Breakfast') ? 'Yes' : 'No'
    };
    return sideActivitiesCSV;
};

// Function to retrieve data for the provided badge IDs and export to CSV
const getDataForCSV = async (badgeIds: string[]) => {
    try {
        console.log("badgeIdsIN", badgeIds)
        // $or: [{ attendantInformation: { $in: badgeIds }  }, { associatedInformation: { $in: badgeIds }  }] }).populate(['associatedInformation', 'attendantInformation']
        // Retrieve data for the provided badge IDs from the BadgeModel
        const badges = await BadgeModel.find({ $or: [{ attendantInformation: { $in: badgeIds } }, { associatedInformation: { $in: badgeIds } }] }).populate(['associatedInformation', 'attendantInformation']) as IbadgeNew[];

        // const badges = await BadgeModel.find().populate(['associatedInformation', 'attendantInformation']) as IbadgeNew[]
        console.log("badges.lenght", badges.length);
        // Transform data into CSV format
        const csvData = [];

        // Process badges
        badges.forEach(badge => {
            const badgeCSV = {
                no: badge._id,
                Delegate_Name: badge.attendantInformation?.attendeeInformation.fullName ?? badge.associatedInformation?.attendeeInformation.fullName,
                Company_Name: badge.attendantInformation?.companyInformation.companyName ?? badge.associatedInformation?.companyName,
                Member: badge.isMember ? 'Yes' : 'No',
                Country: badge.attendantInformation?.companyInformation.country ?? badge.associatedInformation?.country,
                Email: badge.attendantInformation?.attendeeInformation.email ?? badge.associatedInformation?.attendeeInformation.email,
                Badge_Type: badge.badgeType,
                ...parseSideActivities(badge.sideActivity) // Assuming you have a function to handle side activities
            };
            csvData.push(badgeCSV);
        });

        return csvData;
    } catch (error) {
        console.error('Error retrieving data:', error);
        throw error;
    }
};

// Function to write data to CSV file
export const writeToCSV = async (req: Request, res: Response) => {
    try {
        // Get badge IDs from request body or parameters
        const badgeIds: string[] = req.body.badgeIds;
        
        // const badgeIDS = badgeIds.filter(b => b !== "65bed80c36200023a973a92a")

        const csvData = await getDataForCSV(badgeIds);
        console.log("csvData", csvData.length);
        // Convert data to CSV string
        const csvString = csvData.map(row => Object.values(row).join(',')).join('\n');
        console.log("csvData", csvString.length);

        // Write CSV string to file
        fs.writeFileSync('exported_meetingroom3_Badges.csv', csvString);
        console.log('Data exported to feb07_lalibela_exported_data.csv');
        return res.status(200).json({ message: 'Data exported to CSV' });
    } catch (error) {
        console.error('Error writing to CSV:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
