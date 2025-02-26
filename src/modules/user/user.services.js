import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import { decrypt, encrypt } from "../../utils/encryption/encryption.js";
import { compareHash, hash } from "../../utils/hashing/hash.js";
import {
	resetPasswordEmitter,
	emailEmitter,
} from "../../utils/emails/email.event.js";
import generateSecureOTP from "../../utils/otp/otp.js";
import User from "../../DB/models/user.model.js";
import { generateToken, verifyToken } from "../../utils/token/token.js";
import path from "path";
import fs from "fs";
import cloudinary from "../../utils/fileUploading/cloudinary.config.js";
import { roles } from "../../DB/models/eumsValues/user.enum.js";

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

// deactive account (soft delete)
export const deactiveAccount = asyncHandler(async (req, res, next) => {
	const { _id } = req.user;
	const { password } = req.body;
	const user = await User.findById(_id);
	if (!compareHash({ plainText: password, hashText: user.password })) {
		return next(new Error("invalid password", { cause: 400 }));
	}
	user.freeze = true;
	user.isLoggedIn = false;
	await user.save();
	return res
		.status(200)
		.json({ success: true, message: "Account deactive successfully" });
});



export const ProfilePicture = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(
		req.user._id,
		{
			profilePicture: req.file.path,
		},
		{ new: true }
	);
	return res.status(200).json({ success: true, result: user });
});
export const ProfilePictureCloud = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user._id);
	const { secure_url, public_id } = await cloudinary.uploader.upload(
		req.file.path,
		{
			folder: `users/${user._id}/profilePics`,
		}
	);
	user.profilePicCloud = { secure_url, public_id };
	await user.save();
	return res.json({ success: true, result: { user } });
});

export const Coverpicture = asyncHandler(async (req, res, next) => {
	let images = [];
	for (const file of req.files) {
		images.push(file.path);
	}
	const user = await User.findById(req.user._id);
	user.coverPictures = images;
	await user.save();

	res.status(200).json({ success: true, result: user });
});
export const delProfilePic = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user._id);
	const imagePath = path.resolve(".", user.profilePicture);
	fs.unlinkSync(imagePath);
	user.profilePicture = defaultProfilePic;
	await user.save();
	return res.json({ sucess: true, results: user });
});
export const delProfilePicCloud = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user._id);
	const results = await cloudinary.uploader.destroy(
		user.profilePicCloud.public_id
	);
	if (results.result == "ok") {
		user.profilePicCloud = {
			public_id: publicIdCloud,
			secure_url: secureUrlCloud,
		};
		await user.save();
	}

	return res.json({ sucess: true, results, user });
});
