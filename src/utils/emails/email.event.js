import { EventEmitter } from "events";
import jwt from "jsonwebtoken";
import { subjects } from "./sendEmail.js";
import { changeEmail, signup } from "./templates/generateHtml.js";
import sendEmail from "./sendEmail.js";
import { otpForm } from "./htmlOtp.js";
import  getApplicationEmailTemplate  from "./templates/acccetOrReject.js";

export const emailEmitter = new EventEmitter();
emailEmitter.on("sendMail", async (email) => {
	const token = jwt.sign({ email }, process.env.JWT_SECRET);
	const link = `http://localhost:3000/auth/activateAccount/${token}`;
	await sendEmail({
		to: email,
		subject: subjects.register,
		html: signup(link, "guest"),
	});
});
emailEmitter.on("verifyEmail", async (email, link, userName) => {
	await sendEmail({
		to: email,
		subject: subjects.changeEmail,
		html: changeEmail(link, userName),
	});
});
emailEmitter.on("sendOtp", async (email, otp,userName) => {
	await sendEmail({
		to: email,
		subject: subjects.register,
		html: otpForm(otp, userName),
	});
});
export const resetPasswordEmitter = new EventEmitter();
resetPasswordEmitter.on("sendOtp", async (email, otp, userName) => {
	await sendEmail({
		to: email,
		subject: subjects.resetPassword,
		html: otpForm(otp, userName),
	});
});

export const acceptOrReject = new EventEmitter();
acceptOrReject.on("sendMail",async (email,status,jobTitle,companyName) => {
	await sendEmail({
		to: email,
		subject: subjects.applictionResult,
		html:getApplicationEmailTemplate(status,jobTitle,companyName),
	})
})
