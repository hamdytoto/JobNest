import { Router } from "express";
import * as authService from "./auth.services.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import validation from "../../middlewares/validation.middleware.js";
import * as authValidation from "./auth.validation.js";
const router = Router();
router.post(
	"/register",
	validation(authValidation.register),
	authService.register
);
router.post(
	"/confirm_otp",
	validation(authValidation.confirmOtp),
	authService.confirmOtp
);

// login
router.post(
	"/login_system",
	validation(authValidation.login),
	authService.login
);

// login with gmail
router.post(
	"/login_google",
	validation(authValidation.loginWithGmail),
	authService.loginWithGoogle
);

router.post(
	"/forget_password",
	validation(authValidation.forgetPassword),
	authService.forgetPassword
);

router.post(
	"/reset_password",
	validation(authValidation.resetPassword),
	authService.resetPassword
);

router.post(
	"/refresh_token",
	validation(authValidation.refreshToken),
	authService.refreshToken
);
export default router;
