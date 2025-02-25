import Randomstring from "randomstring";
import { encrypt } from "../encryption/encryption.js";

function generateSecureOTP() {
	const otp = Randomstring.generate({
		length: 6,
		charset: "alphanumeric",
	});
	const isEncrypted = false;
	if (!isEncrypted) return otp;
	return encrypt({ plainText: otp });
}

export default generateSecureOTP;
