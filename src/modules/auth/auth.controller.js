import { Router } from "express";
import * as authService from "./auth.services.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import validation from "../../middlewares/validation.middleware.js";
import * as authValidation from "./auth.validation.js";
const router = Router();
router.post(
	"/verify",
	validation(authValidation.sendOtp),
	asyncHandler(authService.sendOtp)
);
// register
router.post(
	"/register",
	validation(authValidation.register),
	asyncHandler(authService.register)
);
// login
router.post("/login", asyncHandler(authService.login));

// login with gmail
router.post(
	"/loginWithGmail",
	validation(authValidation.loginWithGmail),
	asyncHandler(authService.loginWithGmail)
);

router.post(
	"/forgetPassword",
	validation(authValidation.forgetPassword),
	asyncHandler(authService.forgetPassword)
);

router.post(
	"/resetPassword",
	validation(authValidation.resetPassword),
	asyncHandler(authService.resetPassword)
);

router.post(
	"/refreshToken",
	validation(authValidation.refreshToken),
	asyncHandler(authService.refreshToken)
);
export default router;
