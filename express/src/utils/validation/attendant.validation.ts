import { object, string, TypeOf } from "zod";

export const createAttendantSchema = object({
    params: object({
        id: string({ required_error: "Should have id" })
    }),
    body: object({
        companyName: string({ required_error: "Company name is required" }).optional(),
        country: string().optional(),
        attendeeInformation: object({
            firstName: string({ required_error: "First name is required" }),
            lastName: string({ required_error: "Last name is required" }),
            nationality: string({ required_error: "Nationality is required" }),
            email: string({ required_error: "Email is required" }).email({ message: 'Invalid email address' }),
            phoneNumber: string({ required_error: "Phone number is required" }),
        }),
        badgeType: string({ required_error: "Badge type is required" }),

    }),
});
export const getAttendantSchema = object({
    params: object({
        name: string({ required_error: "Should have name" }).optional(),
        id: string({ required_error: "Should have id" }).optional()

    }),
});

export const updateAttendantSchema = object({
    params: object({
        id: string({ required_error: "Should have id" })
    }),
    body: object({
        companyInformation: object({
            companyName: string().optional(),
            country: string().optional(),
            city: string().optional(),
        }).optional(),
        attendeeInformation: object({
            fullName: string().optional(),
            nationality: string().optional(),
            email: string().email({ message: 'Invalid email address' }).optional(),
            phoneNumber: string().optional(),
        }).optional(),
        exhibitorId: string().optional(),
        Position: string().optional()
    }),
});

export const deleteAttendantSchema = object({
    params: object({
        id: string({ required_error: "Should have id" })
    }),
});

export type createAttendantInput = TypeOf<typeof createAttendantSchema>["body" | "params"];
export type getAttendantInput = TypeOf<typeof getAttendantSchema>["params"];
export type updateAttendantInput = TypeOf<typeof updateAttendantSchema>["params"];
export type deleteAttendantInput = TypeOf<typeof deleteAttendantSchema>["params"];
