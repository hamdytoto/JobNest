import joi from "joi";
import {
	fileObject,
	isvalidObjectId,
} from "../../middlewares/validation.middleware.js";

export const createPost = joi
	.object({
		text: joi.string().min(3).max(1000),
		file: joi.array().items(joi.object(fileObject)),
	})
	.or("text", "file");

export const updatePost = joi.object({
		id: joi.custom(isvalidObjectId).required(),
		text: joi.string().min(3).max(1000),
		file: joi.array().items(joi.object(fileObject)),
	})
	.or("text", "file");

export const SoftDeletePost = joi.object({
	id: joi.custom(isvalidObjectId).required(),
});
export const restorePost = joi.object({
	id: joi.custom(isvalidObjectId).required(),
});

export const getSinglePost = joi.object({
	id: joi.custom(isvalidObjectId).required(),
});
export const likeUnlikePost = joi.object({
	id: joi.custom(isvalidObjectId).required(),
});
