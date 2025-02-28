import joi from "joi";
import {
	fileObject,
	isvalidObjectId,
} from "../../middlewares/validation.middleware.js";
import { numberOfEmployees } from "../../DB/models/eumsValues/company.enum.js";
export const createCompany = joi
	.object({
		companyName: joi.string().required().max(10),
		description: joi.string().required(),
		industry: joi.string().required(),
		address: joi.string().required(),
		numberOfEmployees: joi
			.string()
			.required()
			.valid(...Object.values(numberOfEmployees)),
		companyEmail: joi.string().required().email(),
		file: joi.object(fileObject).optional(),
		// legalAttachment:joi.object(fileObject).optional(),
	})
	.required();

export const updateCompany = joi
	.object({
		id: joi.custom(isvalidObjectId).required(),
		companyName: joi.string().required().max(10),
		description: joi.string().required(),
		industry: joi.string().required(),
		address: joi.string().required(),
		numberOfEmployees: joi
			.string()
			.required()
			.valid(...Object.values(numberOfEmployees)),
		companyEmail: joi.string().required().email(),
		file: joi.object(fileObject).optional(),
	})
	.required();

export const searchCompany = joi.object({
	name: joi.string().required(),
});

/////
const genericFunc = (key) => {
	return joi.object({
		[key]: joi.custom(isvalidObjectId).required(),
	});
};
export const deleteCompany = genericFunc("id");
export const getCompany = genericFunc("id");

const genericFunc2 = (key) => {
	return joi.object({
		[key]: joi.custom(isvalidObjectId).required(),
		file: joi.object(fileObject).required(),
	});
};
export const uploadLogo = genericFunc2("id");
export const uploadCover = genericFunc2("id");
export const deleteLogo = genericFunc("id");
export const deleteCover = genericFunc("id");
