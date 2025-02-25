import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import { decrypt, encrypt } from "../../utils/encryption/encryption.js";
import { compareHash, hash } from "../../utils/hashing/hash.js";
import {
	resetPasswordEmitter,
	emailEmitter,
} from "../../utils/emails/email.event.js";
import generateSecureOTP from "../../utils/otp/otp.js";
import User, {
	defaultProfilePic,
	publicIdCloud,
	secureUrlCloud,
} from "../../DB/models/user.model.js";
import { generateToken, verifyToken } from "../../utils/token/token.js";
import path from "path";
import fs from "fs";
import cloudinary from "../../utils/fileUploading/cloudinary.config.js";

export const profile = asyncHandler(async (req, res, next) => {
	// who are you ?
	// token frontend
	const { user } = req;
	// decrpt phone
	const decryptedPhone = decrypt({ cipherText: user.phone });
	return res
		.status(200)
		.json({ success: true, result: { ...user, phone: decryptedPhone } });
});
// update profile
export const updateProfile = asyncHandler(async (req, res, next) => {
	const { _id } = req.user;
	if (req.body.phone) {
		req.body.phone = encrypt({ plainText: req.body.phone });
	}
	const result = await User.findByIdAndUpdate(
		_id,
		{ ...req.body },
		{ new: true, runValidators: true }
	);
	return res
		.status(200)
		.json({ success: true, message: "Profile updated successfully", result });
});
export const updateEmail = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;
	const user = await User.findOne(req.user._id);

	if (!compareHash({ plainText: password, hashText: user.password })) {
		return next(new Error("invalid password", { cause: 400 }));
	}
	user.tempMail = email;
	await user.save();
	const token = generateToken({ payload: { email, id: user._id } });
	const link = `http://localhost:3000/user/verify-email/${token}`;
	emailEmitter.emit("verifyEmail", email, link, user.userName);
	return res
		.status(200)
		.json({ success: true, message: "verification link sent" });
});
export const verifyEmail = asyncHandler(async (req, res, next) => {
	const { token } = req.params;
	const { email, id } = verifyToken({ token });
	const user = await User.findById(id);
	if (!user) {
		return next(new Error("invalid user", { cause: 400 }));
	}
	user.email = user.tempMail;
	user.tempMail = null;
	await user.save();
	return res
		.status(200)
		.json({ success: true, message: "Email verified successfully" });
});

// update password
export const updatePassword = asyncHandler(async (req, res, next) => {
	const { _id } = req.user;
	const { oldPassword, newPassword } = req.body;
	const user = await User.findById(_id);
	if (!compareHash({ plainText: oldPassword, hashText: user.password })) {
		return next(new Error("invalid old password", { cause: 400 }));
	}
	user.password = hash({ plainText: newPassword });
	user.isLoggedIn = false;
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

export const forgetPassword = asyncHandler(async (req, res, next) => {
	const { email } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		return next(new Error("User not found", { cause: 404 }));
	}

	const otp = generateSecureOTP();
	resetPasswordEmitter.emit("sendOtp", email, otp);

	user.otp = hash({ plainText: otp });
	user.otpExiry = Date.now() + 10 * 60 * 1000; // 10 minutes
	await user.save();

	return res
		.status(200)
		.json({ success: true, message: "Password reset email sent successfully" });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
	const { newPassword, email, otp } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		return next(new Error("User not found", { cause: 404 }));
	}
	if (!compareHash({ plainText: otp, hashText: user.otp })) {
		return next(new Error("invalid otp", { cause: 400 }));
	}
	if (Date.now() > user.otpExiry) {
		return next(new Error("otp expired", { cause: 400 }));
	}

	user.password = hash({ plainText: newPassword });
	user.isLoggedIn = false;
	user.otp = null;
	user.otpExiry = null;
	await user.save();
	return res
		.status(200)
		.json({ success: true, message: "Password reset successfully" });
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
