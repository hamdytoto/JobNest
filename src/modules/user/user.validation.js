import joi from "joi";
import { isvalidObjectId } from "../../middlewares/validation.middleware.js";
export const updateProfile = joi
	.object({
		userName: joi.string().min(5).max(20),
		phone: joi.string().required(),
		email: joi.string().email(),
	})
	.required();

export const updatePassword = joi
	.object({
		oldPassword: joi.string().required(),
		newPassword: joi
			.string()
			.not(joi.ref("oldPassword"))
			.messages({
				"any.invalid": "New password must be different from old password",
			})
			.required(),
		confirmPassword: joi.string().required().valid(joi.ref("newPassword")),
	})
	.required();

export const deactiveAccount = joi
	.object({
		password: joi.string().required(),
	})
	.required();

export const forgetPassword = joi
	.object({
		email: joi.string().email().required(),
	})
	.required();

export const resetPassword = joi
	.object({
		email: joi.string().email().required(),
		otp: joi.string().required().max(6).min(6),
		newPassword: joi.string().required(),
	})
	.required();

export const updateEmail = joi
	.object({
		email: joi.string().email().required(),
		password: joi.string().required(),
	})
	.required();

	