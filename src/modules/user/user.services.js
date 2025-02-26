import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import {  encrypt } from "../../utils/encryption/encryption.js";
import { compareHash, hash } from "../../utils/hashing/hash.js";
import User from "../../DB/models/user.model.js";
import cloudinary from "../../utils/fileUploading/cloudinary.config.js";
import { roles } from "../../DB/models/eumsValues/user.enum.js";
import defaultImages from "../../utils/fileUploading/defaultImages.js";
const { profileImage, coverImage } = defaultImages;
// using  mongoose hooks in user model to decrypt mobileNumber
export const profile = asyncHandler(async (req, res, next) => {
	const { _id } = req.user;
	const user = await User.findById(_id);
	return res.status(200).json({ success: true, result: user });
});
// update profile
export const updateProfile = asyncHandler(async (req, res, next) => {
	const { _id } = req.user;
	const { firstName, lastName, gender, DOB, mobileNumber } = req.body;
	const updateData = {};

	// Check if request body is empty
	if (Object.keys(req.body).length === 0) {
		return next(new Error("No data to update", { cause: 400 }));
	}

	if (firstName) updateData.firstName = firstName;
	if (lastName) updateData.lastName = lastName;
	if (gender) updateData.gender = gender;
	if (DOB) updateData.DOB = DOB;
	if (mobileNumber) {
		updateData.mobileNumber = encrypt({ plainText: mobileNumber });
	}
	const updatedUser = await User.findByIdAndUpdate(_id, updateData, {
		new: true,
		runValidators: true,
	});

	if (!updatedUser) {
		return next(new Error("User not found", { cause: 404 }));
	}

	return res
		.status(200)
		.json({ success: true, message: "Profile updated successfully" });
});

export const profileUser = asyncHandler(async (req, res, next) => {
	const { userId } = req.params;
	const user = await User.findById(userId).select(
		"username mobileNumber profilePic coverPic role -_id "
	);
	if (user.role === roles.admin) {
		return next(new Error("You can't view this user profile", { cause: 403 }));
	}

	if (!user) {
		return next(new Error("User not found", { cause: 404 }));
	}
	return res.status(200).json({
		success: true,
		data: user,
	});
});

// update password
export const updatePassword = asyncHandler(async (req, res, next) => {
	const { _id } = req.user;
	const { oldPassword, newPassword } = req.body;
	const user = await User.findById(_id);
	if (!compareHash({ plainText: oldPassword, hashText: user.password })) {
		return next(new Error("invalid old password", { cause: 400 }));
	}
	user.password = newPassword;
	user.changeCredentialTime = new Date();
	await user.save();
	return res
		.status(200)
		.json({ success: true, message: "Password updated successfully" });
});

export const ProfilePictureCloud = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user._id);
	console.log(req.file.path);
	const { secure_url, public_id } = await cloudinary.uploader.upload(
		req.file.path,
		{
			folder: `${process.env.CLOUD_FOLDER}/users/${user._id}/profilePics`,
		}
	);
	user.profilePic = { secure_url, public_id };
	await user.save();
	return res.json({
		success: true,
		result: "Profile picture uploaded successfully",
	});
});
export const coverPictureCloud = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user._id);
	console.log(req.file.path);
	const { secure_url, public_id } = await cloudinary.uploader.upload(
		req.file.path,
		{
			folder: `${process.env.CLOUD_FOLDER}/users/${user._id}/coverPics`,
		}
	);
	user.coverPic = { secure_url, public_id };
	await user.save();
	return res.json({
		success: true,
		result: "Cover picture uploaded successfully",
	});
});

export const delProfilePicCloud = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user._id);
	const results = await cloudinary.uploader.destroy(user.profilePic.public_id);
	if (results.result == "ok") {
		user.profilePic = {
			public_id: profileImage.defaultPublicId,
			secure_url: profileImage.defaultUrl,
		};
		await user.save();
	}
	
	return res.json({ sucess: true, results, user });
});
export const delCoverPicCloud = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user._id);
	const results = await cloudinary.uploader.destroy(user.coverPic.public_id);
	if (results.result == "not found") return next(new Error("Image not found"));
	if (results.result == "ok") {
		user.coverPic = {
			public_id: coverImage.defaultPublicId,
			secure_url: coverImage.defaultUrl,
		};
		await user.save();
	}
	
	return res.json({ sucess: true, results });
});

// deactive account (soft delete)
export const deactiveAccount = asyncHandler(async (req, res, next) => {
	const { _id } = req.user;
	const { password } = req.body;
	const user = await User.findById(_id);
	if (!compareHash({ plainText: password, hashText: user.password })) {
		return next(new Error("invalid password", { cause: 400 }));
	}
	if (user.deletedAt) {
		return next(new Error("User is already deleted", { cause: 400 }));
	}
	user.deletedAt = new Date();
	await user.save();

	res.json({ success: true, message: "User soft deleted successfully." });
});