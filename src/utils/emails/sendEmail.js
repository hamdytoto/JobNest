import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const subjects = {
	register: "active account",
	registerOtp: "register otp",
	resetPassword: "reset password",
	changeEmail: "change email",
	applictionResult:"application result"
};
const sendEmail = async ({ to, subject, html }) => {
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASS,
		},
		tls:{
			rejectUnauthorized: false
		}
	});
	const info = await transporter.sendMail({
		from: `"${process.env.SENDER_NAME}" <${process.env.EMAIL}>`,
		to,
		subject,
		html,
	});

	return info.rejected.length == 0 ? true : false;
};
export default sendEmail;
