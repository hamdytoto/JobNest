import Joi from "joi";
import { isvalidObjectId } from "../../middlewares/validation.middleware.js";
import { roles } from "../../DB/models/user.model.js";

export const changeRole = Joi.object({
	userId: Joi.custom(isvalidObjectId).required(),
	role: Joi.string()
		.valid(...Object.values(roles))
		.required(),
}).required();
