import User, { roles } from "../DB/models/user.model.js";

export const canChangeRole = async (req, res, next) => {
	const AllRoles = Object.values(roles);
	const { role } = req.user;
	const user = await User.findById(req.body.userId);
	// if (role === user.role) {
	// 	return next(new Error("You can't change your role", { cause: 403 }));
	// }
	const canChange = AllRoles.indexOf(role) < AllRoles.indexOf(user.role);
	if (!canChange) {
		return next(new Error("You can't change this user role", { cause: 403 }));
	}

	next();
};
