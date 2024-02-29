import { object, string, TypeOf, number } from "zod";

export const createExhibitorSchema = object({
    body: object({
        boothType: string().optional(),
        paymentStatus: string().optional(),
        companyInformation: object({
            companyName: string({ required_error: "Company name is required" }),
            country: string().optional(),
            city: string().optional(),
            position: string().optional(),
        }),
        typeofBadges: object({
            fullDelegate: number().optional(),
            daypass: number().optional(),

        }),
        representativeInformation: object({
            firstName: string({ required_error: "First name is required" }),
            lastName: string({ required_error: "Last name is required" }),
            email: string({ required_error: "Email is required" }).email({ message: 'Invalid email address' }),
            phoneNumber: string({ required_error: "Phone number is required" }),
        }),
    }),
});

export const getExhibitorSchema = object({
    params: object({
        id: string({ required_error: "Should have id" })
    }),
});

export const updateExhibitorSchema = object({
    params: object({
        id: string({ required_error: "Should have id" })
    }),
    body: object({
        boothType: string().optional(),
        paymentStatus: string().optional(),
        companyInformation: object({
            companyName: string().optional(),
            country: string().optional(),

        }).optional(),
        representativeInformation: object({
            firstName: string().optional(),
            lastName: string().optional(),
            email: string().email({ message: 'Invalid email address' }).optional(),
            phoneNumber: string().optional(),
        }).optional(),
    }),
});

export const deleteExhibitorSchema = object({
    params: object({
        id: string({ required_error: "Should have id" })
    }),
});

export type createExhibitorInput = TypeOf<typeof createExhibitorSchema>["body"];
export type getExhibitorInput = TypeOf<typeof getExhibitorSchema>["params"];
export type updateExhibitorInput = TypeOf<typeof updateExhibitorSchema>["params"];
export type deleteExhibitorInput = TypeOf<typeof deleteExhibitorSchema>["params"];
