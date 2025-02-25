import joi from "joi";
import { roles } from "../../DB/models/user.model.js";
export const sendOtp = joi.object({
	email: joi.string().email().required(),
});
export const register = joi
	.object({
		email: joi.string().email().required(),
		otp: joi.string().length(6).required(),
		password: joi.string().required(),
		confirmPassword: joi.string().required().valid(joi.ref("password")),
		userName: joi.string().min(5).max(20).required(),
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
		password: joi.string().required(),
		confirmPassword: joi.string().required().valid(joi.ref("password")),
	})
	.required();

export const refreshToken = joi
	.object({
		refresh_token: joi.string().required(),
	})
	.required();
