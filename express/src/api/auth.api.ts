import express from "express";

// import { SecureAPIForAdmin } from "../middleware/authJWT";

// import { AuthJWT } from "../middleware/authJWT";
import validateSchema from "../middleware/validateSchema.middleware";
import { ForgotPasswordSchema, ResetPasswordSchema, activateUserSchema, changePasswordSchema, loginUserSchema, registerUserSchema,  } from "../utils/validation/auth.validation";
import { refreshToken, resetPasswordHandler, login, forgotPassword, logout, registerUser, activateUser, changePassword } from '../controller/auth/index.controller'


const router = express.Router();

router.post("/register", validateSchema(registerUserSchema), registerUser);
router.post("/login", validateSchema(loginUserSchema), login);
router.post("/logout", logout);
router.get("/refresh", refreshToken)
router.post("/forgotPassword", validateSchema(ForgotPasswordSchema), forgotPassword)
router.post("/resetPassword", validateSchema(ResetPasswordSchema), resetPasswordHandler)
router.post("/activate", validateSchema(activateUserSchema), activateUser);


export default router;
