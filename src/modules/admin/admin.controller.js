import { Router } from "express";
import isAuthenticated from "../../middlewares/auth.middleware.js";
import isAuthrized from "../../middlewares/authrazation.middleware.js";
import validation from "../../middlewares/validation.middleware.js";
import * as adminServics from "./admin.services.js";
import { adminEndPoints } from "./admin.endPoints.js";
import { canChangeRole } from "../../middlewares/canChangeRole.middleware.js";
import endPoint from "../post/post.endPoints.js";
import * as adminValidation from "./admin.validation.js";
const router = Router();

router.get(
	"/",
	isAuthenticated,
	isAuthrized(...adminEndPoints.getAllUsers),
	adminServics.getAllUsers
);
router.patch(
	"/changeRole",
	isAuthenticated,
	isAuthrized(...adminEndPoints.changeRole),
	validation(adminValidation.changeRole),
	canChangeRole,
	adminServics.changeRole
);
// change role
export default router;
