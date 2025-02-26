import joi from "joi";
import { isvalidObjectId } from "../../middlewares/validation.middleware.js";
import { genders } from "../../DB/models/eumsValues/user.enum.js";
export const register = joi
	.object({
		firstName: joi.string().required(),
		lastName: joi.string().required(),
		password: joi.string().required(),
		email: joi.string().email().required(),
		DOB: joi.date().required(),
		mobileNumber: joi
			.string()
			.regex(/^01[0-2,5]{1}[0-9]{8}$/)
			.required(),
		gender: joi
			.string()
			.valid(...Object.values(genders))
			.required(),
	})
	.required();

export const confirmOtp = joi
	.object({
		email: joi.string().email().required(),
		otp: joi.string().required(),
	})
	.required();

export const login = joi
	.object({
		email: joi.string().email().required(),
		password: joi.string().required(),
	})
	.required();

export const loginWithGmail = joi.object({
	idToken: joi.string().required(),
});
export const forgetPassword = joi.object({
	email: joi.string().email().required(),
});

export const resetPassword = joi
	.object({
		email: joi.string().email().required(),
		otp: joi.string().length(6).required(),
		newPassword: joi.string().required(),
		confirmPassword: joi.string().required().valid(joi.ref("newPassword")),
	})
	.required();

export const refreshToken = joi
	.object({
		refresh_token: joi.string().required(),
	})
	.required();
