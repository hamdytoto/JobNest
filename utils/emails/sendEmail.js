import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const subjects = {
	register: "active account",
	registerOtp: "register otp",
	resetPassword: "reset password",
	changeEmail: "change email",
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
		from: `"social app" <${process.env.EMAIL}>`,
		to,
		subject,
		// text:"test text form nodemailer"
		html,
	});

	return info.rejected.length == 0 ? true : false;
	// console.log(info);
};
export default sendEmail;
// sendEmail();
