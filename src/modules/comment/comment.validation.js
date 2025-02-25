import joi from "joi";
import {
	fileObject,
	isvalidObjectId,
} from "./../../middlewares/validation.middleware.js";
export const createComment = joi
	.object({
		postId: joi.custom(isvalidObjectId).required(),
		text: joi.string(),
		file: joi.object(fileObject),
	})
	.or("text", "file")
	.required();

export const updateComment = joi
	.object({
		commentId: joi.custom(isvalidObjectId).required(),
		text: joi.string().required(),
		file: joi.object(fileObject),
	})
	.or("text", "file")
	.required();



const genericFunc = (key) => {
	return joi.object({
		[key]: joi.custom(isvalidObjectId).required(),
	});
};
export const deleteComment = genericFunc("commentId");
export const getComments = genericFunc("postId");
export const likeUnlikeComment = genericFunc("commentId");

export const replyComment = joi.object({
	commentId: joi.custom(isvalidObjectId).required(),
	text: joi.string().required(),
	file: joi.object(fileObject),
	postId: joi.custom(isvalidObjectId).required(),
}).or("text", "file");
// export const likeUnlikeComment = genericFunc("commentId");

export const hardDelete = joi.object({
	commentId: joi.custom(isvalidObjectId).required(),
	postId: joi.custom(isvalidObjectId).required(),
}).required();