import User from "../DB/models/user.model.js";
import { asyncHandler } from "../utils/errors/asyncHandler.js";
import { verifyToken } from "../utils/token/token.js";

const isAuthenticated = asyncHandler(async (req, res, next) => {
	const { authorization } = req.headers; // Get token from headers
	if (!authorization) {
		return next(new Error("Token Not Found", { cause: 403 }));
	}

	if (!authorization.startsWith("Bearer ")) {
		return next(new Error("Token does not start with Bearer", { cause: 403 }));
	}

	const token = authorization.split(" ")[1];

	// Verify token
	const decoded = verifyToken({ token });

	// Check user
	const user = await User.findById(decoded.id, {
		password: 0,
		__v: 0,
		OTP: 0,
	}).lean();

	if (!user) {
		return next(new Error("User Not Found", { cause: 403 }));
	}

	if (!user.isConfirmed) {
		return next(new Error("Confirm your account first before logging in", { cause: 403 }));
	}

	// Check if password was changed after token was issued
	const lastCredentialUpdate = user.changeCredentialTime
		? Math.floor(new Date(user.changeCredentialTime).getTime() / 1000)
		: 0;

	if (decoded.iat < lastCredentialUpdate) {
		return next(new Error("Session expired. Please log in again.", { cause: 401 }));
	}

	// Attach user to request
	req.user = user;
	next();
});

export default isAuthenticated;
