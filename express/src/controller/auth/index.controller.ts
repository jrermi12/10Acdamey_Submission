import { changePassword } from "./changePassword.auth.controller";
import { logout } from "./logout.auth.controller";
import { forgotPassword } from "./forgetPassword.auth.controller";
import { login } from "./login.auth.controller";
import { resetPasswordHandler } from "./resetPassword.auth.controller";
import { refreshToken } from "./resetToken.auth.controller";
import {registerUser} from "./register.controller"
import { activateUser } from "./verify.auth.controller"
export { refreshToken, activateUser, resetPasswordHandler,registerUser, login, forgotPassword, logout, changePassword }