import { object, string, TypeOf, date, array } from "zod";

export const createUserSchema = object({
    body: object({
        firstName: string({ required_error: "Should have first name" }).min(1, { message: 'First name should have at least 1 character' }).max(20, { message: 'First name should have at most 20 characters' }),
        lastName: string({ required_error: "Should have last name" }).min(1, { message: 'Last name should have at least 1 character' }).max(20, { message: 'Last name should have at most 20 characters' }),
        email: string({ required_error: "Should have email" }).email({ message: 'Invalid email address' }),
        password: string({ required_error: "Should have password" }).min(6, { message: 'Password should have at least 6 characters' }).optional(),
        confirmPassword: string({ required_error: "Should have confirm password" }).min(6, { message: 'confirmPassword should have at least 6 characters' }).optional(),
        phoneNumber: string().optional(),
        role: string()
    }).refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    }).optional()
});



export const getUserSchema = object({
    params: object({
        id: string({ required_error: "Should have id" })

    })
});


export const updateUserSchema = object({
    params: object({
        id: string({ required_error: "Should have id" })
    }),
    body: object({
        firstName: string({ required_error: "Should have first name" }).min(1, { message: 'First name should have at least 1 character' }).max(20, { message: 'First name should have at most 20 characters' }),
        lastName: string({ required_error: "Should have last name" }).min(1, { message: 'Last name should have at least 1 character' }).max(20, { message: 'Last name should have at most 20 characters' }),
        email: string({ required_error: "Should have email" }).email({ message: 'Invalid email address' }),
        phoneNumber: string().optional(),
        role: string().optional(),
        standingPosition: string().optional(),
        standingPositionType: string().optional()
    })

})

export const deleteUserSchema = object({
    params: object({
        id: string({ required_error: "Should have id" })
    }),

});
export type createUserInput = TypeOf<typeof createUserSchema>["body"];
export type deleteUserInput = TypeOf<typeof deleteUserSchema>["params"];
export type updateUserInput = TypeOf<typeof updateUserSchema>["params"];
export type getUsersInput = TypeOf<typeof getUserSchema>["params"];

