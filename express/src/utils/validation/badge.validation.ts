import { z, object, string, boolean, array, TypeOf } from 'zod';

export const registerAndCreateBadgeSchema = object({
    body: array(
        object({
            companyInformation: object({
                companyName: string({ required_error: "Company name is required" }),
                country: string({ required_error: "Country is required" }),
                city: string({ required_error: "City is required" }),
                Position: string({ required_error: "Position is required" }),
            }),
            attendeeInfo: object({
                fullName: string({ required_error: "First name is required" }),
                nationality: string({ required_error: "Nationality is required" }),
                email: string({ required_error: "Email is required" }).email({ message: 'Invalid email address' }),
                phoneNumber: string({ required_error: "Phone number is required" }),
                Position: string({ required_error: "Position is required" }).optional(),

            }),
            exhibitorId: string({ required_error: "Exhibitor id is required" }).optional(),
            sideActivity: array(string()), // Updated to handle an array of side activities
            isMember: boolean().optional(),
            badgeType: string({ required_error: "Badge type is required" }).optional(),
            selectedDays: array(string().optional()).optional()
        })
    ),
});

export type registerAndCreateBadgeInput = TypeOf<typeof registerAndCreateBadgeSchema>["body"];


export const updateBadgeSchema = object({
    body: object({
        companyInformation: object({
            companyName: string({ required_error: "Company name is required" }).optional(),
            country: string({ required_error: "Country is required" }).optional(),
        }).optional(),
        attendeeInfo: object({
            fullName: string({ required_error: "First name is required" }).optional(),
            nationality: string({ required_error: "Nationality is required" }).optional(),
            email: string({ required_error: "Email is required" }).email({ message: 'Invalid email address' }).optional(),
            phoneNumber: string({ required_error: "Phone number is required" }).optional(),

        }).optional(),
        Position: string({ required_error: "Position is required" }).optional(),
        selectedDays: array(string()).optional(),
        assocaitId: string({ required_error: "assocait id is required" }).optional(),
        attendiId: string({ required_error: "assocait id is required" }).optional(),
        sideActivity: array(string()).optional(),
        paymentStatus: string({ required_error: "Payment status is required" }).optional(),
        badgeType: string({ required_error: "Badge type is required" }).optional().optional(),
    }
    ),
    params: z.object({
        badge_id: string(),
    }),
});
export type updateBadgeInput = TypeOf<typeof updateBadgeSchema>["body"];
export const scanBadgeSchema = object({
    body: object({
        badgeId: string(),
        standingPosition: string(),
        standingPositionType: string().optional()
    }
    ),
});
export type scanBadgeInput = TypeOf<typeof scanBadgeSchema>["body"];