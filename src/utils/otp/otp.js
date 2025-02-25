import Randomstring from "randomstring";
import { encrypt } from "../encryption/encryption.js";

function generateSecureOTP() {
	const otp = Randomstring.generate({
		length: 6,
		charset: "alphanumeric",
	});
	return otp;
}

export default generateSecureOTP;
