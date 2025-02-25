import Post from "../../DB/models/post.model.js";
import User from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

export const getAllUsers = asyncHandler(async (req, res, next) => {
	// const users = await User.find();
	// const Posts = await Post.find();
	const [users, Posts] = await Promise.all([User.find(), Post.find()]); // this is better than the above
	res.status(200).json({ users, Posts });
});

export const changeRole = asyncHandler(async (req, res, next) => {
	const { userId, role } = req.body;
	const user = await User.findById(userId);
	if (!user) {
		return next(new Error("User Not Found", { cause: 404 }));
	}
	user.role = role;
	await user.save();
	res.status(200).json({ message: "Role Changed Successfully", user });
});
