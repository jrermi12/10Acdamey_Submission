import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { registerAndCreateBadgeInput } from '../../utils/validation/badge.validation';
import BadgeModel from '../../model/badge.model';
import AttendantModel from '../../model/attendant.model';
import { findExhibitorById } from "../../services/exhibitor.service"
import { parseCSVData } from "./parse.badge";
import AssociatedModel from "../../model/associatedexhibitors.model"
import { sideActivityData, badgeTypeData } from "../../utils/sideactivity"
import ExhibitorModel from "../../model/exhibitor.model"
export const createBadgeHandler = asyncHandler(async (req: Request<{}, {}>, res: Response) => {
    try {
        let parsedData;
        if (req.file && req.file) {
            const csvData = req.file.buffer.toString();
            parsedData = parseCSVData(csvData);
        } else if (req.body && Array.isArray(req.body)) {
            // If data is directly sent in the request body
            parsedData = req.body;
        } else {
            throw new Error("Invalid request format. Please provide either a CSV file or data in the request body.");
        }
        const responseData = await Promise.all(parsedData.map(async (data) => {
            const { attendeeInfo, isMember, companyInformation, sideActivity, exhibitorId, selectedDays } = data;
            console.log("sideActivity", data.sideActivity)
            let badgeType = data?.badgeType
            console.log({ badgeType })
            const seletedDayslength = selectedDays?.length;

            if (badgeType === "Ethiopia Rate") {
                badgeType = "Ethiopian Farmer Badge";
            }

            // Find the corresponding badge type data
            const badgeTypeDetails = badgeTypeData.find(type => type.name === badgeType);
            console.log({ badgeTypeDetails })

            if (!badgeTypeDetails) {
                console.log("this is the errro")
                throw new Error("Invalid badge type");
            }

            let totalPrice = 0;
            if (badgeType === "Day Badge") {
                console.log({ badgeTypeDetails })
                console.log({ seletedDayslength })
                totalPrice += isMember ? badgeTypeDetails.price_member * seletedDayslength : badgeTypeDetails.price_non_member * seletedDayslength;
            } else {
                console.log({ badgeTypeDetails })

                totalPrice += isMember ? badgeTypeDetails.price_member : badgeTypeDetails.price_non_member;

            }
            console.log("asdasdasds")
            console.log({ totalPrice })
            if (sideActivity.length > 0) {
                sideActivity.forEach(activity => {
                    console.log("activity", activity)
                    const side = sideActivityData.items.find(item => item.event === activity)
                    console.log("side", side)
                    if (side) {
                        const x = side[badgeType];
                        console.log("x", x);

                        if (x) {
                            console.log(`Skipping price for ${badgeType}`);
                        } else {
                            const activityDetails = sideActivityData.items.find(item => item.event === activity && item.isMember === isMember);
                            if (activityDetails) {
                                const activityPrice = isMember ? activityDetails.cost : activityDetails.cost;
                                totalPrice += activityPrice;
                                console.log('totalprice2', totalPrice)
                            }
                        }
                    };
                });
            } else {
                console.log(`No matching side activity found for event ${sideActivity}`);
                // Handle this case as needed
            }

            if (badgeType.toLowerCase() === "exhibitor") {
                const newAsscoiated = new AssociatedModel({
                    attendeeInformation: attendeeInfo,
                    exhibitorId: exhibitorId,
                    companyName: companyInformation.companyName,
                    country: companyInformation.country,

                })
                const savedAssociated = await newAsscoiated.save();
                const exhibitors = await ExhibitorModel.find()
                const exhibitor = exhibitors.find(
                    (exhibitor) => exhibitor.companyInformation.companyName === savedAssociated.companyName
                );
                if (exhibitor) {
                    exhibitor.fullDelegate = exhibitor.fullDelegate - 1
                    await exhibitor.save()
                }

                // console.log("totalCost", totalCost)
                const newBadge = new BadgeModel({
                    badgeType: badgeType,
                    associatedInformation: savedAssociated._id,
                    isMember: isMember,
                    sideActivity: sideActivity, // Added sideActivity to Badge model
                    price: totalPrice,
                    selectedDays: selectedDays?.length ? selectedDays : []
                });
                // Save the Badge document to the database
                const savedBadge = await newBadge.save();
                // Return relevant information
                return {
                    attendantId: savedAssociated._id,
                    // associatedId: savedAssociated._id,
                    badgeId: savedBadge._id,
                };
            } else {
                console.log("am here")
                // Create a new Attendant document
                const newAttendant = new AttendantModel({
                    companyInformation: companyInformation,
                    attendeeInformation: attendeeInfo,
                });
                // Save the Attendant document to the database
                const savedAttendant = await newAttendant.save();
                // Create a new Badge document
                const newBadge = new BadgeModel({
                    badgeType: badgeType,
                    attendantInformation: savedAttendant._id,
                    isMember: isMember,
                    sideActivity: sideActivity, // Added sideActivity to Badge model
                    price: totalPrice,
                    selectedDays: selectedDays?.length ? selectedDays : []

                });
                console.log("newBadge", newBadge)
                console.log("am here 2")

                // Save the Badge document to the database
                const savedBadge = await newBadge.save();
                // Return relevant information
                return {
                    attendantId: savedAttendant._id,
                    badgeId: savedBadge._id,
                };
            }
        }));

        // Return the response data
        res.status(201).json({
            success: true,
            message: "Attendees registered and badges created successfully",
            data: responseData,
            lenght: responseData.length
        });
    } catch (error) {
        // Handle any unexpected errors during badge creation
        console.error("Error during badge creation:", error.message);
        res.status(500).json({
            success: false,
            error: error,
            message: "Internal server error",
        });
    }
});



export const calculateAndSaveTotalPrices = async (res: Response, req: Request) => {
    try {
        // Get all badge documents
        const badges = await BadgeModel.find({});

        // Loop through each badge and calculate the total price
        for (const badge of badges) {
            await calculateTotalPrice(badge);
        }

        console.log("Total prices calculated and saved for all badges");
        res.status(200).json({
            success: true,
            message: "Total prices calculated and saved for all badges",
        });
    } catch (error) {
        console.error("Error calculating total prices:", error);
        throw error;
    }
}




export async function calculateTotalPrice(badge): Promise<number> {
    try {
        let badgeType = badge.badgeType;
        const isMember = badge.isMember;
        const selectedSideActivities = badge.sideActivity;
        const seletedDayslength = badge.selectedDays?.length;

        if (badgeType === "Ethiopia Rate") {
            badgeType = "Ethiopian Farmer Badge";
        }
        console.log("badgeType", badgeType);
        console.log("selectedSideActivities", selectedSideActivities);
        console.log("seletedDayslength", seletedDayslength);

        // Find the corresponding badge type data
        const badgeTypeDetails = badgeTypeData.find(type => type.name === badgeType);
        if (!badgeTypeDetails) {
            throw new Error("Invalid badge type");
        }
        console.log("badgeTypeDetails", badgeTypeDetails)
        let totalPrice = 0;
        if (badgeType === "Day Badge") {
            totalPrice += isMember ? badgeTypeDetails.price_member * seletedDayslength : badgeTypeDetails.price_non_member * seletedDayslength;
        } else {
            totalPrice += isMember ? badgeTypeDetails.price_member : badgeTypeDetails.price_non_member;
        }
        console.log("totalPrice", totalPrice)
        selectedSideActivities.forEach(activity => {
            const side = sideActivityData.items.find(item => item.event === activity)

            if (side) {
                const x = side[badgeType];
                console.log("x", x);

                if (x) {
                    console.log(`Skipping price for ${badgeType}`);
                    console.log(`zzzzzz`);
                } else {
                    const activityDetails = sideActivityData.items.find(item => item.event === activity && item.isMember === isMember);
                    console.log("activityDetails", activityDetails)
                    if (activityDetails) {
                        const activityPrice = isMember ? activityDetails.cost : activityDetails.cost;
                        totalPrice += activityPrice;
                        console.log('totalprice2', totalPrice)
                    }
                }
            }
        });
        console.log("totalPrice", totalPrice)

        // Update the badge document with the calculated total price
        await BadgeModel.findByIdAndUpdate(badge._id, { price: totalPrice });
        console.log("totalPrice", totalPrice)
        return totalPrice;
    } catch (error) {
        console.error("Error calculating total price:", error);
        throw error;
    }
}
