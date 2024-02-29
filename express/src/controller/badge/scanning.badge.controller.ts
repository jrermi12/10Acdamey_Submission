import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { scanBadgeInput } from '../../utils/validation/badge.validation';
import badgeModel, { IBadge, VERIFICATION } from '../../model/badge.model';
import associatedexhibitorsModel from '../../model/associatedexhibitors.model';
import attendantModel from '../../model/attendant.model';
import cron from 'node-cron';
import { today } from '../../utils/util';
import SessionModel from "../../model/session.model"
import IAttendant from '../../interfaces/attendant.interface';
import IAssociatedExhibitor from '../../interfaces/associatedExhibitor.interface';




export const scanBadge = asyncHandler(async (req: Request<{}, {}, scanBadgeInput>, res: Response): Promise<any> => {
    const { badgeId, standingPosition, standingPositionType } = req.body
    console.log(badgeId, standingPosition)
    const badge = await badgeModel.findById(badgeId)
    if (!badge) return res.json({
        data: {
            inValid: true
        }
    })
    if (standingPosition === 'AXUM Hall' ||
        standingPosition === 'Lalibella' ||
        standingPosition === 'Meeting Room 2' ||
        standingPosition === 'Meeting Room 3' ||
        standingPosition === 'Taste of Harvest Room' ||
        standingPosition === 'Members Lounge' ||
        standingPosition === "B2B Cupping Room"
    ) {
        const session = new SessionModel({
            attendeId: badge.attendantInformation ?? badge.associatedInformation,
            scannedPostitions: standingPosition,
            standingPositionType: standingPositionType ?? ""
        })
        await session.save()
        return res.json({
            data: { valid: true }
        })
    }

    if (standingPosition === 'Social events') {
        if (badge.badgeType === 'Ethiopian Farmer Badge') {
            if (badge.verification.lunch.lastEat) {
                const currentTime = new Date();
                const lastAteTime = new Date(badge.verification.lastSocailEvent);
                const timeDifference = currentTime.getTime() - lastAteTime.getTime();
                const hoursDifference = timeDifference / (1000 * 60 * 60);
                const isSideAcitivity = badge.sideActivity.find(a => a === "Social events")
                if (isSideAcitivity) {
                    if (hoursDifference >= 12) {
                        checkIsSideActivity(badge, 'Social events', res)
                    } else {
                        return res.json({
                            data: {
                                used: true
                            }
                        })
                    }
                } else {
                    return res.json({
                        data: {
                            inValid: true
                        }
                    })
                }
            } else {
                badge.verification.lastSocailEvent = new Date();
                const session = new SessionModel({
                    attendeId: badge.attendantInformation ?? badge.associatedInformation,
                    scannedPostitions: "Social events",
                    standingPositionType: standingPositionType ?? ""

                })
                await session.save()
                return res.json({
                    data: { valid: true }
                })
            }
        } else if (badge.badgeType === 'Day Badge' || badge.badgeType === 'Delegate' || badge.badgeType === 'Exhibitor') {
            if (badge.verification.lastSocailEvent) {
                console.log('here buddy')
                const currentTime = new Date();
                const lastAteTime = new Date(badge.verification.lastSocailEvent);
                const timeDifference = currentTime.getTime() - lastAteTime.getTime();
                const hoursDifference = timeDifference / (1000 * 60 * 60);
                if (hoursDifference >= 12) {
                    const session = new SessionModel({
                        attendeId: badge.attendantInformation ?? badge.associatedInformation,
                        scannedPostitions: "Social events",
                        standingPositionType: standingPositionType ?? ""

                    })
                    await session.save()
                    return res.json({
                        data: {
                            valid: true
                        }
                    })
                } else {
                    return res.json({
                        data: {
                            used: true
                        }
                    })
                }

            } else {
                console.log('and here')
                badge.verification.lastSocailEvent = new Date();
                const session = new SessionModel({
                    attendeId: badge.attendantInformation ?? badge.associatedInformation,
                    scannedPostitions: "Social events",
                    standingPositionType: standingPositionType ?? ""

                })
                await session.save()
                await badge.save()
                return res.json({
                    data: { valid: true }
                })
            }

        }
    }
    if (standingPosition === 'Sustainability Day Meeting') {
        checkIsSideActivity(badge, 'Sustainability Day Meeting', res, standingPositionType)
    }
    if (standingPosition === 'Farmers Day') {
        checkIsSideActivity(badge, 'Farmer Day', res, standingPositionType)
    }
    if (standingPosition === 'Workshop: Risk Management Understanding Futures & Options by Judith Ganes') {
        checkIsSideActivity(badge, 'Workshop: Risk Management Understanding Futures & Options by Judith Ganes', res, standingPositionType)

    }
    if (standingPosition === 'Workshop: New Frontiers in Post - Harvest Processing with CQI') {
        checkIsSideActivity(badge, 'Workshop: New Frontiers in Post - Harvest Processing with CQI', res, standingPositionType)
    }
    if (standingPosition === 'IWCA Breakfast') {
        checkIsSideActivity(badge, 'IWCA Breakfast', res, standingPositionType)
    }
    if (standingPosition === 'Entrance') {
        if (badge.badgeType === "Day Badge") {
            const isBought = badge.selectedDays.find(a => a === today())
            if (isBought) {
                checkPresent(badge, res)
            } else {
                return res.json({
                    data: { inValid: true }
                })
            }
        }
        if (badge.badgeType === "Delegate" || badge.badgeType === 'Exhibitor') {
            checkPresent(badge, res, standingPositionType)

        }
        if (badge.badgeType === "Ethiopian Farmer Badge") {
            const daysPresent = badge?.daysPresent
            if (daysPresent < 5) {
                checkPresent(badge, res, standingPositionType)
            } else {
                return res.json({
                    data: { inValid: true }
                })
            }
        }

    }
    if (standingPosition === "Lunch") {
        if (badge.badgeType === "Delegate" || badge.badgeType === 'Exhibitor') {
            if (badge.verification.lunch.eatNumber < 4) {
                checkLastEat(badge, res, standingPositionType)
            } else {
                return res.json({
                    data: {
                        used: true,
                        luchCount: badge.verification.lunch.eatNumber
                    }
                })
            }
        }
        if (badge.badgeType === "Day Badge") {
            if (badge.verification.lunch.eatNumber < 4) {
                checkLastEat(badge, res, standingPositionType)
            } else {
                return res.json({
                    data: {
                        used: true,
                        luchCount: badge.verification.lunch.eatNumber
                    }
                })
            }
        }
        if (badge.badgeType === 'Ethiopian Farmer Badge') {
            if (badge.verification.lunch.eatNumber < 4) {
                checkIsSideActivity(badge, 'Lunch', res, standingPositionType)
            } else {
                return res.json({
                    data: {
                        used: true,
                        luchCount: badge.verification.lunch.eatNumber
                    }
                })
            }

        }
    }
    if (standingPosition === "Bag collection") {
        if (badge.verification.bag_collection.lastBagCollection) {
            res.json({ data: { used: true } });
        }
        else {
            badge.verification.bag_collection.bagCollectionNumber += 1
            badge.verification.bag_collection.lastBagCollection = new Date();
            await badge.save()
            const session = new SessionModel({
                attendeId: badge.attendantInformation ?? badge.associatedInformation,
                scannedPostitions: "Bag collection",
                standingPositionType: standingPositionType ?? ""

            })
            await session.save()
            res.json({ data: { valid: true } });
        }
    }
    // if(!standingPosition) 
})














const checkIsSideActivity = async (badge: IBadge, sideActivity: string, res: Response, standingPositionType?: string): Promise<any> => {

    const isSideAcitivity = badge.sideActivity.find(a => a === sideActivity)
    if (isSideAcitivity) {
        // const newSideActivity = badge.sideActivity.filter(a => a != sideActivity)
        // badge.sideActivity = newSideActivity
        // await badge.save()
        const session = new SessionModel({
            attendeId: badge.attendantInformation ?? badge.associatedInformation,
            scannedPostitions: sideActivity,
            standingPositionType: standingPositionType ?? ""

        })
        await session.save()
        return res.json({
            data: { valid: true }
        })
    } else {
        return res.json({
            data: { inValid: true }
        })
    }

}


const checkPresent = async (badge: IBadge, res: Response, standingPositionType?: string): Promise<any> => {
    const associate = await associatedexhibitorsModel.findById(badge?.associatedInformation)
    const attendant = await attendantModel.findById(badge?.attendantInformation)
    if (associate) {
        associate.isPresent = true
        associate.daysPresent += 1
        await associate.save()
    }
    if (attendant) {
        attendant.isPresent = true
        attendant.daysPresent += 1
        await attendant.save()
    }
    badge.daysPresent = badge.daysPresent + 1
    await badge?.save()
    if (badge.verification?.lastEntrance) {
        const currentTime = new Date();
        const lastAteTime = new Date(badge.verification.lunch.lastEat);
        const timeDifference = currentTime.getTime() - lastAteTime.getTime();
        const hoursDifference = timeDifference / (1000 * 60 * 60);
        if (hoursDifference >= 12) {
            const session = new SessionModel({
                attendeId: badge.attendantInformation ?? badge.associatedInformation,
                scannedPostitions: "Entrance",
                standingPositionType: standingPositionType ?? ""

            })
            await session.save()
        }
    }
    else {
        badge.verification.lastEntrance = new Date();
        const session = new SessionModel({
            attendeId: badge.attendantInformation ?? badge.associatedInformation,
            scannedPostitions: "Entrance",
            standingPositionType: standingPositionType ?? ""

        })
        await session.save()

    }
    return res.json({
        data: { valid: true }
    })
}
const checkLastEat = async (badge: IBadge, res: Response, standingPositionType?: string) => {
    if (badge.verification.lunch.lastEat) {
        const currentTime = new Date();
        const lastAteTime = new Date(badge.verification.lunch.lastEat);
        const timeDifference = currentTime.getTime() - lastAteTime.getTime();
        const hoursDifference = timeDifference / (1000 * 60 * 60);

        if (hoursDifference >= 12) {
            badge.verification.lunch.eatNumber += 1
            badge.verification.lunch.lastEat = new Date();
            await badge.save()
            const session = new SessionModel({
                attendeId: badge.attendantInformation ?? badge.associatedInformation,
                scannedPostitions: "Lunch",
                standingPositionType: standingPositionType ?? ""

            })
            await session.save()
            return res.json({
                data: {
                    luchCount: badge.verification.lunch.eatNumber,
                    valid: true
                }
            });
        } else {

            return res.json({
                data: {
                    used: true,
                    luchCount: badge.verification.lunch.eatNumber
                }
            });
        }
    } else {
        badge.verification.lunch.eatNumber += 1
        badge.verification.lunch.lastEat = new Date();
        await badge.save()
        const session = new SessionModel({
            attendeId: badge.attendantInformation ?? badge.associatedInformation,
            scannedPostitions: "Lunch",
        })
        await session.save()
        return res.json({
            data: {
                valid: true,
                luchCount: badge.verification.lunch.eatNumber

            }
        });
    }

}