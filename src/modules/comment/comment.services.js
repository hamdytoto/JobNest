import Post from "../../DB/models/post.model.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import cloudinary from "../../utils/fileUploading/cloudinary.config.js";
import Comment from "../../DB/models/comment.model.js";
import { roles } from "../../DB/models/user.model.js";
export const createComment = asyncHandler(async (req, res, next) => {
	const { text } = req.body;
	const { postId } = req.params;
	const post = await Post.findOne({ _id: postId, isDeleted: false });
	if (!post) return next(new Error("Post not found"));
	let image;
	if (req.file) {
		const { secure_url, public_id } = await cloudinary.uploader.upload(
			req.file.path,
			{
				folder: `${process.env.CLOUD_FOLDER}/user/${post.user}/posts/${post.cloudFolder}/comments`,
			}
		);
		image = { secure_url, public_id };
	}
	const comment = await Comment.create({
		text,
		image,
		user: req.user._id,
		post: postId,
	});
	return res.status(201).json({ succes: true, results: { comment } });
});

export const updateComment = asyncHandler(async (req, res, next) => {
	const { commentId } = req.params;
	const { text } = req.body;
	const comment = await Comment.findOne({ _id: commentId, isDeleted: false });
	if (!comment) return next(new Error("Comment not found"));
	const post = await Post.findOne({ _id: comment.post, isDeleted: false });
	if (!post) return next(new Error("Post not found"));
	if (req.user._id.toString() !== comment.user.toString())
		return next(new Error("You are not authorized to update this comment"));
	let image;
	if (req.file) {
		const { secure_url, public_id } = await cloudinary.uploader.upload(
			req.file.path,
			{
				folder: `${process.env.CLOUD_FOLDER}/user/${post.user}/posts/${post.cloudFolder}/comments`,
			}
		);
		image = { secure_url, public_id };
		if (comment.image) {
			await cloudinary.uploader.destroy(comment.image.public_id);
		}
		comment.image = image;
	}
	comment.text = text ? text : comment.text;
	await comment.save();
	return res.json({ success: true, results: { comment } });
});

export const deleteComment = asyncHandler(async (req, res, next) => {
	const { commentId } = req.params;
	const { _id } = req.user;
	const comment = await Comment.findOne({ _id: commentId, isDeleted: false });
	if (!comment) return next(new Error("Comment not found"));
	const post = await Post.findOne({ _id: comment.post, isDeleted: false });
	if (!post) return next(new Error("Post not found"));
	const postOwner = post.user.toString() === _id.toString();
	const commentOwner = comment.user.toString() === _id.toString();
	const adminMan = req.user.role === roles.admin;
	if (!postOwner && !commentOwner && !adminMan)
		return next(new Error("You are not authorized to delete this comment"));
	comment.isDeleted = true;
	comment.deletedBy = _id;
	await comment.save();

	return res.json({ success: true, results: { comment } });

	// user who wrote the comment // user whow own the post // admin
});

export const getComments = asyncHandler(async (req, res, next) => {
	const { postId } = req.params;
	const post = await Post.findOne({ _id: postId, isDeleted: false });
	if (!post) return next(new Error("Post not found"));
	const comments = await Comment.find({
		post: postId,
		isDeleted: false,
		comment: { $exists: false },
	}).populate([
		{ path: "user", select: "userName profilePicCloud" },
		{
			path: "replies",
			select: "text image likes user ",
			populate: { path: "user", select: "userName profilePicCloud" },
		},
	]);
	return res.json({ success: true, results: { comments } });
});

export const likeUnlikeComment = asyncHandler(async (req, res, next) => {
	const { commentId } = req.params;
	const userId = req.user._id;
	const comment = await Comment.findOne({ _id: commentId, isDeleted: false });
	if (!comment) return next(new Error("Comment not Found", { cause: 404 }));
	const isExisted = comment.likes.find(
		(like) => like.toString() == userId.toString()
	);
	if (!isExisted) {
		comment.likes.push(userId);
	} else {
		comment.likes = comment.likes.filter(
			(like) => like.toString() != userId.toString()
		);
	}
	await comment.save();
	const populatedComment = await Comment.findOne({
		_id: commentId,
		isDeleted: false,
	}).populate({ path: "likes", select: "userName profilePicCloud.secure_url" });
	return res.json({ sucess: true, populatedComment });
});

export const addReply = asyncHandler(async (req, res, next) => {
	const { commentId, postId } = req.params;
	const { text } = req.body;
	const comment = await Comment.findOne({
		_id: commentId,
		post: postId,
		isDeleted: false,
	});
	if (!comment) return next(new Error("Comment not found"));
	const post = await Post.findOne({
		_id: postId,
		isDeleted: false,
	});
	if (!post) return next(new Error("Post not found"));
	let image;
	if (req.file) {
		const { secure_url, public_id } = await cloudinary.uploader.upload(
			req.file.path,
			{
				folder: `${process.env.CLOUD_FOLDER}/user/${post.user}/posts/${post.cloudFolder}/comments/${comment._id}`,
			}
		);
		image = { secure_url, public_id };
	}
	const reply = await Comment.create({
		...req.body,
		image,
		user: req.user._id,
		post: postId,
		comment: comment._id,
	});
	return res.json({ success: true, results: reply });
});

export const hardDelete = asyncHandler(async (req, res, next) => {
	const { commentId } = req.params;
	const comment = await Comment.findOne({ _id: commentId });
	if (!comment) return next(new Error("Comment not found"));
	const post = await Post.findOne({ _id: comment.post, isDeleted: false });
	if (!post) return next(new Error("Post not found"));
	const commentOwner = comment.user.toString() === req.user._id.toString();
	const postOwner = post.user.toString() === req.user._id.toString();
	const adminMan = req.user.role === roles.admin;
	if (!commentOwner && !postOwner && !adminMan)
		return next(new Error("You are not authorized to delete this comment"));
	// comment delete  .. all replies deleted 
	await comment.deleteOne();
	return res.json({ success: true, results: { comment } });	
}); 
