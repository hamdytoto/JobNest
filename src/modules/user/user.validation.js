import joi from "joi";
import { isvalidObjectId } from "../../middlewares/validation.middleware.js";
import { genders } from "../../DB/models/eumsValues/user.enum.js";
export const updateProfile = joi
	.object({
		firstName: joi.string().min(3).max(20),
		lastName: joi.string().min(3).max(20),
		DOB: joi.date(),
		gender: joi.string().valid(...Object.values(genders)),
		mobileNumber: joi.string().regex(/^01[0-2,5]{1}[0-9]{8}$/),
		//  mobileNumber, DOB ,firstName, lastName, Gender
	})
	.required();

export const profileUser = joi.object({
	userId: joi.custom(isvalidObjectId).required(),
});
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
