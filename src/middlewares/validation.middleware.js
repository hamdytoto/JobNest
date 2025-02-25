import { Types } from "mongoose";
import joi from "joi";
const validation = (schema) => {
	return (req, res, next) => {
		const data = { ...req.body, ...req.params, ...req.query };
		// console.log({ dataBeforefile: data });
		if (req.file || req.files?.length) {
			data.file = req.file || req.files;
		}
		const result = schema.validate(data, { abortEarly: false });
		// console.log({ dataAfterfile: data.file });
		if (result.error) {
			const messageList = result.error.details.map((error) => error.message);
			return next(new Error(messageList, { cause: 400 }));
		}
		return next();
	};
};
export const isvalidObjectId = (value, helper) => {
	// check if the value is a valid ObjectId
	if (Types.ObjectId.isValid(value)) {
		return true;
	}
	return helper.message("Invalid objectId");
};

export const fileObject = {
	fieldname: joi.string().valid("images").required(),
	originalname: joi.string().required(),
	encoding: joi.string().required(),
	mimetype: joi.string().required(),
	size: joi.number().required(),
	destination: joi.string().required(),
	filename: joi.string().required(),
	path: joi.string().required(),
};

export default validation;
