import { object, string, TypeOf, date, array } from "zod";
export const registerUserSchema = object({
    body: object({
        firstName: string({ required_error: "Should have first name" }).min(1, { message: 'First name should have at least 1 character' }).max(20, { message: 'First name should have at most 20 characters' }),
        lastName: string({ required_error: "Should have last name" }).min(1, { message: 'Last name should have at least 1 character' }).max(20, { message: 'Last name should have at most 20 characters' }),
        email: string({ required_error: "Should have email" }).email({ message: 'Invalid email address' }),
        password: string({ required_error: "Should have password" }).min(6, { message: 'Password should have at least 6 characters' }),
        confirmPassword: string({ required_error: "Should have confirm password" }).min(6, { message: 'confirmPassword should have at least 6 characters' }),
        phoneNumber: string().optional(),
    }).refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    }),
});
export const activateUserSchema = object({
    body: object({
        email: string({ required_error: "Should have email" }).email({ message: 'Invalid email address' }),
        verificationCode: string({ required_error: "Should have verification code" }),
    })
});
export const loginUserSchema = object({
    body: object({
        email: string({ required_error: "Should have email" }).email({ message: 'Invalid email address' }),
        password: string({ required_error: "Should have password" }),
    })
});
export const ForgotPasswordSchema = object({
    body: object({
        email: string({ required_error: "Should have email" }).email({ message: 'Invalid email address' }),

    })
});
export const ResetPasswordSchema = object({
    body: object({
        email: string({ required_error: "Should have email" }).email({ message: 'Invalid email address' }),
        passwordResetCode: string({ required_error: "Should have password reset code" }),
        password: string({ required_error: "Should have password" }),

    })
});
export const changePasswordSchema = object({
    body: object({
        email: string({ required_error: "Should have email" }).email({ message: 'Invalid email address' }),
        password: string({ required_error: "Should have password" }),

    })
});
export const changeOldPasswordSchema = object({
    body: object({
        newPassword: string({ required_error: "Should have new password" }),
        oldPassword: string({ required_error: "Should have old password" }),


    })
});
export const updateProfileSchema = object({
    body: object({
        firstName: string().min(1, { message: 'First name should have at least 1 character' }).max(20, { message: 'First name should have at most 20 characters' }).optional(),
        lastName: string().min(1, { message: 'Last name should have at least 1 character' }).max(20, { message: 'Last name should have at most 20 characters' }).optional(),
        phoneNumber: string().min(1, { message: 'Phone number should have at least 1 character' }).optional(),
    })
})

export const googleLoginUserSchema = object({
    body: object({
        token: string({ required_error: "Should have token" }),
        email: string({ required_error: "Should have email" }).email({ message: 'Invalid email address' }),
    })
});


export type registerUserInput = TypeOf<typeof registerUserSchema>["body"];
export type loginUserInput = TypeOf<typeof loginUserSchema>["body"];
export type activateUserInput = TypeOf<typeof activateUserSchema>["body"];

export type forgotPasswordInput = TypeOf<typeof ForgotPasswordSchema>["body"];
export type resetPasswordInput = TypeOf<typeof ResetPasswordSchema>["body"];
export type changePasswordInput = TypeOf<typeof changePasswordSchema>["body"];
export type changeOldPasswordInput = TypeOf<typeof changeOldPasswordSchema>["body"];
export type updateProfileInput = TypeOf<typeof updateProfileSchema>["body"];







