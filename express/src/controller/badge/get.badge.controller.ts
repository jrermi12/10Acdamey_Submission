import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import BadgeModel from '../../model/badge.model';
import NotFoundError from '../../errors/notFound.errors';
import { getAllBadge, findBadgeById } from "../../services/badge.services"
import mongoose from 'mongoose';
import AttendantModel from '../../model/attendant.model';
import AssocieatedModel from "../../model/associatedexhibitors.model";
import fs from "fs"
import SessionModel from "../../model/session.model"
export const getAllBadgesHandler = asyncHandler(async (req: Request, res: Response) => {

    const response = await getAllBadge();

    if (!response) {
        throw new NotFoundError('Badge not found');
    }
    res.status(200).json({
        response,
        length: response.length
    });
});

export const getBadgeByIdHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await findBadgeById(id);
    if (!response) {
        throw new NotFoundError('Attendant not found');
    }
    res.status(200).json(response)
});



export const getBadgescanned = asyncHandler(async (req: Request, res: Response) => {
    
    const response = await BadgeModel.find({"verification.bag_collection.bagCollectionNumber": 1  });
    if (!response) {
        throw new NotFoundError('Attendant not found');
    }
    res.status(200).json({response, length: response.length})
});


// exportDataToCSV function
// export const exportDataToCSV = async (req: Request, Res: Response) => {
//     try {

//         // Get today's date in UTC format
//         const today = new Date();
//         today.setUTCHours(0, 0, 0, 0);

//         // Get tomorrow's date in UTC format (for inclusive date range)
//         const tomorrow = new Date(today);
//         tomorrow.setDate(today.getDate() + 1);
//         // Connect to MongoDB
//         // Fetch data from Badge model and populate associated and attendant models
//         const badges = await BadgeModel.
//         find({
//             createdAt: { $gte: today, $lt: tomorrow } // Filter by today's date
//         }).sort({ createdAt: -1 });

//         // Prepare data for CSV export
//         const csvDataPromises = badges.map(async badge => {
//             if (badge.badgeType !== "Exhibitor") {
//                 const attendant = await AttendantModel.findOne({ _id: badge.attendantInformation });
//                 return {
//                     badgeType: badge.badgeType,
//                     paymentStatus: badge.paymentStatus,
//                     attendeeFullName: attendant.attendeeInformation?.fullName || 'N/A',
//                     attendeeNationality: attendant.attendeeInformation?.nationality || 'N/A',
//                     attendeeEmail: attendant.attendeeInformation?.email || 'N/A',
//                     attendeePhoneNumber: attendant.attendeeInformation?.phoneNumber || 'N/A',
//                     companyName: attendant.companyInformation?.companyName || 'N/A',
//                     country: attendant.companyInformation?.country || 'N/A',
//                     isMember: badge.isMember,
//                     price: badge.price,
//                     daysPresent: badge.daysPresent,
//                 }
//             } else {
//                 const attendant = await AssocieatedModel.findOne({ _id: badge.associatedInformation });
//                 return {
//                     badgeType: badge.badgeType,
//                     paymentStatus: badge.paymentStatus,
//                     attendeeFullName: attendant.attendeeInformation?.fullName || 'N/A',
//                     attendeeNationality: attendant.attendeeInformation?.nationality || 'N/A',
//                     attendeeEmail: attendant.attendeeInformation?.email || 'N/A',
//                     attendeePhoneNumber: attendant.attendeeInformation?.phoneNumber || 'N/A',
//                     attendeePosition: attendant.attendeeInformation?.Position || 'N/A',
//                     companyName: attendant.companyName || 'N/A',
//                     country: attendant.country || 'N/A',
//                     isMember: badge.isMember,
//                     price: badge.price,
//                     daysPresent: badge.daysPresent,
//                 }
//             }
//         });

//         const csvData = await Promise.all(csvDataPromises);

//         // Convert data to CSV format
//         const csvContent = csvData.map(row => Object.values(row).join(',')).join('\n');

//         // Write data to a CSV file
//         fs.writeFileSync('exported_data.csv', csvContent);

//         console.log('Data exported to exported_data.csv successfully.');

//         // Disconnect from MongoDB
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// export const exportDataToCSV = async (req: Request, Res: Response) => {
//     try {
//         // Get today's date in UTC format
//         // const today = new Date();
//         // today.setUTCHours(0, 0, 0, 0);

//         // // Get tomorrow's date in UTC format (for inclusive date range)
//         // const tomorrow = new Date(today);
//         // tomorrow.setDate(today.getDate() + 1);

//         const targetDate = new Date('2024-02-06T09:00:00Z');

//         // Connect to MongoDB
//         // Fetch data from Badge model and populate associated and attendant models
//         const badges = await BadgeModel.find({
//             createdAt: { $lt: targetDate } // Fil
//         }).sort({ createdAt: -1 });

//         // Prepare data for CSV export
//         const csvDataPromises = badges.map(async badge => {
//             let sustainabilityDay = 'No';
//             let farmersDay = 'No';
//             let socialEvents = 'No';
//             let riskManagementWorkshop = 'No';
//             let postHarvestWorkshop = 'No';
//             let iwcaBreakfast = 'No';

//             badge.sideActivity.forEach(activity => {
//                 switch (activity) {
//                     case 'Sustainability Day':
//                         sustainabilityDay = 'Yes';
//                         break;
//                     case 'Farmers Day':
//                         farmersDay = 'Yes';
//                         break;
//                     case 'Social events':
//                         socialEvents = 'Yes';
//                         break;
//                     case 'Workshop: Risk Management Understanding Futures & Options by Judith Ganes':
//                         riskManagementWorkshop = 'Yes';
//                         break;
//                     case 'Workshop: New Frontiers in Post-Harvest Processing with CQI':
//                         postHarvestWorkshop = 'Yes';
//                         break;
//                     case 'IWCA Breakfast':
//                         iwcaBreakfast = 'Yes';
//                         break;
//                 }
//             });

//             if (badge.badgeType !== "Exhibitor") {
//                 const attendant = await AttendantModel.findOne({ _id: badge.attendantInformation });
//                 return {
//                     'Delegate Name': attendant.attendeeInformation?.fullName || 'N/A',
//                     'Company Name': attendant.companyInformation?.companyName || 'N/A',
//                     'Member': badge.isMember ? 'Yes' : 'No',
//                     'Country': attendant.companyInformation?.country || 'N/A',
//                     'Email': attendant.attendeeInformation?.email || 'N/A',
//                     'Badge Type': badge.badgeType || 'N/A',
//                     'Sustainability Day': sustainabilityDay,
//                     'Farmers Day': farmersDay,
//                     'Social events': socialEvents,
//                     'Workshop: Risk Management Understanding Futures & Options by Judith Ganes': riskManagementWorkshop,
//                     'Workshop: New Frontiers in Post-Harvest Processing with CQI': postHarvestWorkshop,
//                     'IWCA Breakfast': iwcaBreakfast
//                 };
//             } else {
//                 const attendant = await AssocieatedModel.findOne({ _id: badge.associatedInformation });
//                 return {
//                     'Delegate Name': attendant.attendeeInformation?.fullName || 'N/A',
//                     'Company Name': attendant.companyName || 'N/A',
//                     'Member': badge.isMember ? 'Yes' : 'No',
//                     'Country': attendant.country || 'N/A',
//                     'Email': attendant.attendeeInformation?.email || 'N/A',
//                     'Badge Type': badge.badgeType || 'N/A',
//                     'Sustainability Day': sustainabilityDay,
//                     'Farmers Day': farmersDay,
//                     'Social events': socialEvents,
//                     'Workshop: Risk Management Understanding Futures & Options by Judith Ganes': riskManagementWorkshop,
//                     'Workshop: New Frontiers in Post-Harvest Processing with CQI': postHarvestWorkshop,
//                     'IWCA Breakfast': iwcaBreakfast
//                 };
//             }
//         });

//         const csvData = await Promise.all(csvDataPromises);

//         // Convert data to CSV format
//         const headers = Object.keys(csvData[0]).join(',') + '\n';
//         const rows = csvData.map(row => Object.values(row).join(','));

//         // Write data to a CSV file
//         fs.writeFileSync('exported_databeofrefeb69am.csv', headers + rows.join('\n'));

//         console.log('Data exported to exported_data.csv successfully.');

//         // Disconnect from MongoDB
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }



export const exportDataToCSV = async (req: Request, Res: Response) => {
    try {
        
        const badges = await BadgeModel.find({ // Filter by badges created before the target date
            'verification.bag_collection.bagCollectionNumber': 0 , 'verification.lunch.eatNumber' : 1}).sort({ createdAt: -1 });
        console.log(badges);
        // Prepare data for CSV expor1
        const csvDataPromises = badges.map(async badge => {
            let sustainabilityDay = 'No';
            let farmersDay = 'No';
            let socialEvents = 'No';
            let riskManagementWorkshop = 'No';
            let postHarvestWorkshop = 'No';
            let iwcaBreakfast = 'No';

            badge.sideActivity.forEach(activity => {
                switch (activity) {
                    case 'Sustainability Day':
                        sustainabilityDay = 'Yes';
                        break;
                    case 'Farmers Day':
                        farmersDay = 'Yes';
                        break;
                    case 'Social events':
                        socialEvents = 'Yes';
                        break;
                    case 'Workshop: Risk Management Understanding Futures & Options by Judith Ganes':
                        riskManagementWorkshop = 'Yes';
                        break;
                    case 'Workshop: New Frontiers in Post-Harvest Processing with CQI':
                        postHarvestWorkshop = 'Yes';
                        break;
                    case 'IWCA Breakfast':
                        iwcaBreakfast = 'Yes';
                        break;
                }
            });

            if (badge.badgeType !== "Exhibitor") {
                const attendant = await AttendantModel.findOne({ _id: badge.attendantInformation });
                return {
                    'Delegate Name': attendant.attendeeInformation?.fullName || 'N/A',
                    'Company Name': attendant.companyInformation?.companyName || 'N/A',
                    'Member': badge.isMember ? 'Yes' : 'No',
                    'Country': attendant.companyInformation?.country || 'N/A',
                    'Email': attendant.attendeeInformation?.email || 'N/A',
                    'Badge Type': badge.badgeType || 'N/A',
                    'Sustainability Day': sustainabilityDay,
                    'Farmers Day': farmersDay,
                    'Social events': socialEvents,
                    'Workshop: Risk Management Understanding Futures & Options by Judith Ganes': riskManagementWorkshop,
                    'Workshop: New Frontiers in Post-Harvest Processing with CQI': postHarvestWorkshop,
                    'IWCA Breakfast': iwcaBreakfast
                };
            } else {
                const attendant = await AssocieatedModel.findOne({ _id: badge.associatedInformation });
                return {
                    'Delegate Name': attendant.attendeeInformation?.fullName || 'N/A',
                    'Company Name': attendant.companyName || 'N/A',
                    'Member': badge.isMember ? 'Yes' : 'No',
                    'Country': attendant.country || 'N/A',
                    'Email': attendant.attendeeInformation?.email || 'N/A',
                    'Badge Type': badge.badgeType || 'N/A',
                    'Sustainability Day': sustainabilityDay,
                    'Farmers Day': farmersDay,
                    'Social events': socialEvents,
                    'Workshop: Risk Management Understanding Futures & Options by Judith Ganes': riskManagementWorkshop,
                    'Workshop: New Frontiers in Post-Harvest Processing with CQI': postHarvestWorkshop,
                    'IWCA Breakfast': iwcaBreakfast
                };
            }
        });

        const csvData = await Promise.all(csvDataPromises);

        // Convert data to CSV format
        const headers = Object.keys(csvData[0]).join(',') + '\n';
        const rows = csvData.map(row => Object.values(row).join(','));

        // Write data to a CSV file
        fs.writeFileSync('exported_data.notsaccned.csv', headers + rows.join('\n'));

        console.log('Data exported to exported_data.csv successfully.');

        // Disconnect from MongoDB
    } catch (error) {
        console.error('Error:', error);
    }
}








