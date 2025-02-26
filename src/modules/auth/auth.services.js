import User from "./../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import { otpTypes, providers } from "./../../DB/models/eumsValues/user.enum.js";
import { verifyToken } from "../../utils/token/token.js";
import { OAuth2Client } from "google-auth-library";
import {
	emailEmitter,
	resetPasswordEmitter,
} from "../../utils/emails/email.event.js";
import { compareHash, hash } from "../../utils/hashing/hash.js";
import { generateToken } from "../../utils/token/token.js";
import generateSecureOTP from "../../utils/otp/otp.js";
import { isvalidObjectId } from "../../middlewares/validation.middleware.js";

export const register = asyncHandler(async (req, res, next) => {
	const { email } = req.body;
	const userman = await User.findOne({ email });
	if (userman) {
		return res.status(400).json({ message: "Email already exists" });
	}
	// create user
	const user = await User.create({
		...req.body,
	});
	const createdOtp = generateSecureOTP();
	emailEmitter.emit("sendOtp", email, createdOtp, user.username);
	user.OTP.push({
		code: hash({ plainText: createdOtp }),
		type: otpTypes.confirmEmail,
		expiresIn: new Date(Date.now() + 10 * 60 * 1000),
	});
	await user.save();

	return res.status(200).json({ success: true, results: user });
});

export const confirmOtp = asyncHandler(async (req, res, next) => {
	const { email, otp } = req.body;
	// check for user existence
	const user = await User.findOne({ email });
	if (!user) return next(new Error("user Not Found", { cause: 400 }));
	// filtering based on otpType and sorting based on expireIn to get the latest one
	const savedOtp = user.OTP.filter(
		(ele) => ele.type == otpTypes.confirmEmail
	).sort((a, b) => b.expiresIn - a.expiresIn)[0];

	if (!savedOtp) return next(new Error("OTP Not Found", { cause: 400 }));

	if (savedOtp.expiresIn < new Date())
		return next(new Error("Otp has been expired", { cause: 400 }));

	const isValid = compareHash({ plainText: otp, hashText: savedOtp.code });
	if (!isValid) return next(new Error("Not Correct OTP", { cause: 400 }));

	user.isConfirmed = true;
	await user.save();
	return res.json({ success: true, results: user });
});

export const login = async (req, res, next) => {
	const { email, password } = req.body;
	// check user existance
	const user = await User.findOne({ email });
	if (!user) {
		return next(new Error("User not found", { cause: 404 }));
	}

	if (!user.isConfirmed) {
		return next(new Error("Account not activated", { cause: 400 }));
	}
	// verify
	if (!compareHash({ plainText: password, hashText: user.password })) {
		return next(new Error("Wrong password", { cause: 400 }));
	}
	await user.save();
	return res.status(200).json({
		success: "login success",
		access_token: generateToken({
			payload: {
				id: user._id,
				email: user.email,
			},
			options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "1d" },
		}),
		refresh_token: generateToken({
			payload: {
				id: user._id,
				email: user.email,
			},
			options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || "7d" },
		}),
	});
};

export const loginWithGoogle = asyncHandler(async (req, res, next) => {
	const { idToken } = req.body;
	const client = new OAuth2Client();
	async function verify() {
		const ticket = await client.verifyIdToken({
			idToken,
			audience: process.env.CLIENT_ID,
		});
		const payload = ticket.getPayload();
		return payload;
	}
	const userData = await verify();
	const { email_verified, email, name, picture } = userData;
	if (!email_verified)
		return next(new Error("Email not Valid", { cause: 400 }));
	let user = await User.findOne({ email });
	if (!userTest) {
		user = await User.create({
			email,
			userName: name,
			profilePic: {
				secure_url: picture,
			},
			isConfirmed: true,
			provider: providers.google,
		});
	}
	const access_token = generateToken({
		payload: {
			id: user._id,
			email: user.email,
		},
		options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "1d" },
	});
	const refresh_token = generateToken({
		payload: { id: user._id, email: user.email },
		options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || "7d" },
	});

	return res.status(200).json({
		success: "login success",
		access_token,
		refresh_token,
	});
});

export const forgetPassword = asyncHandler(async (req, res, next) => {
	const { email } = req.body;
	const user = await User.findOne({ email, isConfirmed: true, bannedAt: null });
	if (!user) {
		return next(new Error("User not found", { cause: 404 }));
	} else if (user.bannedAt) {
		return next(new Error("You are banned", { cause: 400 }));
	}
	user.OTP = user.OTP.filter((ele) => ele.type !== otpTypes.forgotPassword);
	const otp = generateSecureOTP();
	user.OTP.push({
		code: hash({ plainText: otp }),
		type: otpTypes.forgotPassword,
		expiresIn: new Date(Date.now() + 10 * 60 * 1000),
	});
	await user.save();
	resetPasswordEmitter.emit("sendOtp", email, otp, user.username);
	return res
		.status(200)
		.json({ success: true, message: "otp send successfully" });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
	const { email, otp, newPassword } = req.body;

	const user = await User.findOne({ email, isConfirmed: true, bannedAt: null });
	if (!user) {
		return next(new Error("User not found", { cause: 404 }));
	}

	const otpRecord = user.OTP.find((o) => o.type === otpTypes.forgotPassword);
	if (!otpRecord) {
		return next(new Error("OTP not found", { cause: 400 }));
	}

	if (new Date() > otpRecord.expiresIn) {
		await User.updateOne(
			{ email },
			{ $pull: { OTP: { type: otpTypes.forgotPassword } } }
		);
		return next(new Error("OTP has expired", { cause: 400 }));
	}

	if (!compareHash({ plainText: otp, hashText: otpRecord.code })) {
		return next(new Error("Invalid OTP", { cause: 400 }));
	}

	await User.updateOne(
		{ email },
		{
			$set: {
				password: hash({ plainText: newPassword }),
				changeCredentialTime: Date.now(),
			},
			$pull: { OTP: { type: otpTypes.forgotPassword } }, // Remove used OTP
		}
	);

	return res
		.status(200)
		.json({ success: true, message: "Password reset successfully" });
});

// request new acces token
export const refreshToken = asyncHandler(async (req, res, next) => {
	const { refresh_token } = req.body;
	const payload = verifyToken({ token: refresh_token });
	const user = await User.findById(payload.id);
	if (!user) {
		return next(new Error("User not found", { cause: 404 }));
	}
	if (
		user.changeCredentialTime &&
		new Date(user.changeCredentialTime).getTime() > payload.iat * 1000
	) {
		return next(
			new Error(
				"Token expired due to credential change. Please log in again.",
				{ cause: 403 }
			)
		);
	}
	return res.status(200).json({
		success: " new refreshToken created sucessfully",
		access_token: generateToken({
			payload: {
				id: user._id,
				email: user.email,
			},
			options: { expiresIn: process.env.RXPIREEFRESH_TOKEN_EXPIRE },
		}),
	});
});
