import { nanoid } from "nanoid";
import Post from "../../DB/models/post.model.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import cloudinary from "../../utils/fileUploading/cloudinary.config.js";
import { roles } from "../../DB/models/user.model.js";
import Comment from "../../DB/models/comment.model.js";

export const createPost = asyncHandler(async (req, res, next) => {
	const { text } = req.body;
	let images = [];
	let cloudFolder;
	if (req.files.length) {
		cloudFolder = nanoid();
		for (const file of req.files) {
			const { secure_url, public_id } = await cloudinary.uploader.upload(
				file.path,
				{
					folder: `${process.env.CLOUD_FOLDER}/user/${req.user._id}/posts/${cloudFolder}`,
				}
			);
			images.push({ secure_url, public_id });
		}
	}
	const post = await Post.create({
		text,
		images,
		cloudFolder,
		user: req.user._id,
	});
	res.status(201).json({ succes: true, results: { post } });
});

export const updatePost = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const { _id } = req.user;
	const { text } = req.body;
	const post = await Post.findOne({ _id: id, user: _id });
	if (!post) return new Error("post not found", { cause: 404 });
	let images = [];
	if (req.files.length) {
		for (const file of req.files) {
			const { secure_url, public_id } = await cloudinary.uploader.upload(
				file.path,
				{
					folder: `${process.env.CLOUD_FOLDER}/user/${req.user._id}/posts/${post.cloudFolder}`,
				}
			);
			images.push({ secure_url, public_id });
		}
	}
	if (post.images.length) {
		for (const image of post.images) {
			await cloudinary.uploader.destroy(image.public_id);
		}
	}
	post.text = text ? text : post.text;
	post.images = images;
	await post.save();
	res.status(200).json({ success: true, results: { post } });
});

export const SoftDeletePost = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const post = await Post.findOne({ _id: id });
	if (!post) return new Error("post not found", { cause: 404 });
	if (
		post.user.toString() === req.user._id.toString() ||
		req.user.role === roles.admin
	) {
		post.isDeleted = true;
		post.deletedBy = req.user._id;
	}
	await post.save();
	res.status(200).json({ success: true, results: { post } });
});

export const restorePost = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const post = await Post.findOneAndUpdate(
		{ _id: id, isDeleted: true, deletedBy: req.user._id },
		{ isDeleted: false, $unset: { deletedBy: 1 } },
		{ new: true, runValidators: true }
	);
	if (!post) return new Error("post not found", { cause: 404 });
	res.status(200).json({ success: true, results: { post } });
});

export const getSinglePost = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const post = await Post.findOne({ _id: id, isDeleted: false }).populate([
		{
			path: "user",
			select: "userName  profilePicCloud.secure_url",
		},
		{
			path: "comments",
			select: "text image likes user",
			match: { comment: { $exists: false }, isDeleted: false },
			populate: [
				{ path: "user", select: "userName profilePicCloud.secure_url" },
				{
					path: "replies",
					select: "text image likes user",
				},
			],
		},
	]);
	if (!post) return new Error("post not found", { cause: 404 });
	res.status(200).json({ success: true, results: { post } });
});

export const getActivePosts = asyncHandler(async (req, res, next) => {
	let results = [];
	let posts = Post.find({
		isDeleted: false,
		user: req.user._id,
	})
		.populate({
			path: "user",
			select: "userName  profilePicCloud.secure_url",
		})
		.cursor();
	for (let post = await posts.next(); post != null; post = await posts.next()) {
		const comments = await Comment.find({
			post: post._id,
			isDeleted: false,
		}).select("text image likes user");
		results.push({ post, comments });
	}

	return res.status(200).json({ success: true, results });
});

export const archivedPosts = asyncHandler(async (req, res, next) => {
	let posts;
	if (req.user.role === roles.admin) {
		posts = await Post.find({ isDeleted: true }).populate({
			path: "user",
			select: "userName  profilePicCloud.secure_url",
		});
	} else if (req.user.role === roles.user) {
		posts = await Post.find({ isDeleted: true, user: req.user._id }).populate({
			path: "user",
			select: "userName  profilePicCloud.secure_url",
		});
	}
	return res.status(200).json({ success: true, results: { posts } });
});

export const likeUnlikePost = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const userId = req.user._id;
	const post = await Post.findOne({ _id: id, isDeleted: false });
	if (!post) return next(new Error("Post not Found", { cause: 404 }));
	const isExisted = post.likes.find(
		(like) => like.toString() == userId.toString()
	);
	if (!isExisted) {
		post.likes.push(userId);
	} else {
		post.likes = post.likes.filter(
			(like) => like.toString() != userId.toString()
		);
	}
	await post.save();
	const populatedPost = await Post.findOne({
		_id: id,
		isDeleted: false,
	}).populate({ path: "likes", select: "userName profilePicCloud.secure_url" });
	return res.json({ sucess: true, result: { populatedPost } });
});
