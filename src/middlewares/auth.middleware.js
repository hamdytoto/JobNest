import User from "../DB/models/user.model.js";
import { asyncHandler } from "../utils/errors/asyncHandler.js";
import { verifyToken } from "../utils/token/token.js";
const isAuthenticated = asyncHandler(async (req, res, next) => {
	const { authorization } = req.headers; // token
	if (!authorization) {
		return next(new Error("Token Not Found", { cause: 403 }));
	}

	if (!authorization.startsWith("Bearer ")) {
		return next(new Error("Token Not start with Bearer", { cause: 403 }));
	}
	const token = authorization.split(" ")[1];
	// verify token
	const { id } = verifyToken({ token });

	// check user
	const user = await User.findById(id, { password: 0 }).lean();

	if (!user) {
		return next(new Error("User Not Found", { cause: 403 }));
	}
	if (!user.isLoggedIn) {
		return next(new Error("User Not Logged In", { cause: 403 }));
	}
	req.user = user;
	return next();
});

export default isAuthenticated;
