import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { updateBadgeInput, updateBadgeSchema } from '../../utils/validation/badge.validation';
import { z } from 'zod';
import { findBadgeById } from '../../services/badge.services';
import NotFoundError from '../../errors/notFound.errors';
import { PAYMENT_STATUS, SELECTED_DATE, SIDE_ACTIVITY } from '../../model/badge.model';
import { findAttendantById } from '../../services/asscoiatedExhbitor.service';
import associatedexhibitorsModel from '../../model/associatedexhibitors.model';
import { findAttendantsById } from '../../services/attendent.services';
import attendantModel from '../../model/attendant.model';
import { badgeTypeData, sideActivityData } from '../../utils/sideactivity';


export const updateBadgeHandler = asyncHandler(async (req: Request<z.TypeOf<typeof updateBadgeSchema>["params"], {}, updateBadgeInput>, res: Response) => {
    try {
        const { companyInformation, attendeeInfo, sideActivity, paymentStatus, assocaitId,  Position, attendiId, selectedDays, } = req.body
        const badgeId = req.params?.badge_id
        const badge = await findBadgeById(badgeId)
        if (!badge) throw new NotFoundError("Badge doesnt exist!")

        let badgeType = req.body?.badgeType
        const seletedDayslength = selectedDays?.length;

        if (badgeType === "Ethiopia Rate") {
            badgeType = "Ethiopian Farmer Badge";
        }

        // Find the corresponding badge type data
        const badgeTypeDetails = badgeTypeData.find(type => type.name === badgeType);
        if (!badgeTypeDetails) {
            throw new Error("Invalid badge type");
        }

        let totalPrice = 0;
        if (badgeType === "Day Badge") {
            totalPrice += badge?.isMember ? badgeTypeDetails.price_member * seletedDayslength : badgeTypeDetails.price_non_member * seletedDayslength;
        } else {
            totalPrice += badge?.isMember ? badgeTypeDetails.price_member : badgeTypeDetails.price_non_member;
            console.log('totalprice1', totalPrice)

        }

        console.log({ badgeType })
        console.log({ sideActivity })
        sideActivity.forEach(activity => {
            const side = sideActivityData.items.find(item => item.event === activity)
            const x = side?.[badgeType]
            console.log(x)
            if (x) {
                console.log(`Skipping price for ${badgeType}`);
            } else {
                const activityDetails = sideActivityData.items.find(item => item.event === activity && item.isMember === badge?.isMember);

                if (activityDetails) {
                    const activityPrice = badge?.isMember ? activityDetails.cost : activityDetails.cost;
                    totalPrice += activityPrice;
                    console.log('totalprice2', totalPrice)
                }
            }
        });
        if (badgeType) badge.badgeType = badgeType
        badge.price = totalPrice
        if (sideActivity?.length) badge.sideActivity = sideActivity as SIDE_ACTIVITY[]
        if (selectedDays?.length) badge.selectedDays = selectedDays as SELECTED_DATE[]

        if (paymentStatus) badge.paymentStatus = paymentStatus as PAYMENT_STATUS

        if (assocaitId) {
            const associated = await findAttendantById(assocaitId)
            if (!associated) throw new NotFoundError("Associated doesnt exist!")
            associated.attendeeInformation.fullName = attendeeInfo?.fullName
            associated.attendeeInformation.email = attendeeInfo?.email
            associated.attendeeInformation.phoneNumber = attendeeInfo?.phoneNumber
            associated.attendeeInformation.Position = Position
            associated.companyName = companyInformation?.companyName
            associated.country = companyInformation?.country

            await associated?.save()
        }
        console.log("hhi")
        if (attendiId) {
            const attendant = await findAttendantsById(attendiId)
            if (!attendant) throw new NotFoundError("Attendant doesnt exist!")
            attendant.attendeeInformation.fullName = attendeeInfo?.fullName
            attendant.attendeeInformation.email = attendeeInfo?.email
            attendant.attendeeInformation.phoneNumber = attendeeInfo?.phoneNumber
            attendant.companyInformation.Position = Position
            attendant.companyInformation.companyName = companyInformation?.companyName,
            attendant.companyInformation.country = companyInformation?.country,

            await attendant?.save()
        }
        await badge.save()
        res.status(200).json({
            message: 'Badge updated successfully',
            success: true
        });

    } catch (error) {
        // Handle any unexpected errors during badge creation
        console.error("Error during badge creation:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
