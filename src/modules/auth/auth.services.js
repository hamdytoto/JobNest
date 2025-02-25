import User from "./../../DB/models/user.model.js";
import Otp from "../../DB/models/otp.model.js";
import { provdiers } from "./../../DB/models/user.model.js";
import { verifyToken } from "../../utils/token/token.js";
import { OAuth2Client } from "google-auth-library";
import {
	emailEmitter,
	resetPasswordEmitter,
} from "../../utils/emails/email.event.js";
import {compareHash } from "../../utils/hashing/hash.js";
import { generateToken } from "../../utils/token/token.js";
import generateSecureOTP from "../../utils/otp/otp.js";

export const register = async (req, res, next) => {
	const { email, otp } = req.body;
	const userman = await User.findOne({ email });
	if (userman) {
		return res.status(400).json({ message: "Email already exists" });
	}
	const otpgiven = await Otp.findOne({ email, otp });
	if (!otpgiven) {
		return next(new Error("Invalid otp", { cause: 400 }));
	}
	// create user
	const user = await User.create({
		...req.body,
		isAcctivated: true,
	});


	return res.status(200).json({ success: true, results: user });
};

export const login = async (req, res, next) => {
	const { email, password } = req.body;
	// check user existance
	const user = await User.findOne({ email });
	if (!user) {
		return next(new Error("User not found", { cause: 404 }));
	}

	if (!user.isAcctivated) {
		return next(new Error("Account not activated", { cause: 400 }));
	}
	// check password
	// verify
	if (!compareHash({ plainText: password, hashText: user.password })) {
		return next(new Error("Wrong password", { cause: 400 }));
	}
	user.isLoggedIn = true;
	user.freeze = false;
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

export const loginWithGoogle = async (req, res, next) => {
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
	const user = await User.create({
		email,
		userName: name,
		profilePic: picture,
		isAcctivated: true,
		provider: provdiers.google,
	});
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
};

export const sendOtp = async (req, res, next) => {
	const { email } = req.body;
	// check user existance
	const user = await User.findOne({ email });
	if (user) return new Error("User already exist", { cause: 400 });

	const savedOtp = await Otp.create({
		email,
		otp: generateSecureOTP(),
	});
	emailEmitter.emit("sendOtp", email, savedOtp.otp);
	return res.status(200).json({ success: true, results: savedOtp });
};

export const forgetPassword = async (req, res, next) => {
	const { email } = req.body;
	const user = await User.findOne({ email, isAcctivated: true, freeze: false });
	if (!user) {
		return next(new Error("User not found", { cause: 404 }));
	} else if (user.freeze) {
		return next(new Error("Account deactive", { cause: 400 }));
	}
	const otp = generateSecureOTP();
	await Otp.create({
		email,
		otp,
	});
	resetPasswordEmitter.emit("sendOtp", email, otp);
	return res.status(200).json({ success: true, results: otp });
};

export const resetPassword = async (req, res, next) => {
	const { email, password, otp } = req.body;
	const user = await User.findOne({ email, isAcctivated: true });
	if (!user) {
		return next(new Error("User not found", { cause: 404 }));
	} else if (user.freeze) {
		return next(new Error("Account deactive", { cause: 400 }));
	}
	const otpgiven = await Otp.findOne({ email, otp });
	if (!otpgiven) {
		return next(new Error("Invalid otp", { cause: 400 }));
	}
	user.password = password;
	user.isLoggedIn = false;
	await user.save();
	return res
		.status(200)
		.json({ success: true, message: "Password updated successfully" });
};

//reques new acces token
export const refreshToken = async (req, res, next) => {
	const { refresh_token } = req.body;
	const payload = verifyToken({ token: refresh_token });
	const user = await User.findById(payload.id);
	if (!user) {
		return next(new Error("User not found", { cause: 404 }));
	}
	return res.status(200).json({
		success: "login success",
		access_token: generateToken({
			payload: {
				id: user._id,
				email: user.email,
			},
			options: { expiresIn: process.env.RXPIREEFRESH_TOKEN_EXPIRE },
		}),
	});
};
