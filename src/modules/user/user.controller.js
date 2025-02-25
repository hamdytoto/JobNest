import { Router } from "express";
import * as userServices from "./user.services.js";
import * as userValidation from "./user.validation.js";
import validation from "../../middlewares/validation.middleware.js";
import isAuthenticated from "../../middlewares/auth.middleware.js";
import isAuthrized from "../../middlewares/authrazation.middleware.js";
import endPoints from "./user.endPoint.js";
import {
	fileValidation,
	folderNames,
	upload,
} from "../../utils/fileUploading/multerUpload.js";
import { cloudUpload } from "../../utils/fileUploading/cloud.multer.js";
const router = Router();
// show profile
router.get(
	"/profile",
	isAuthenticated,
	isAuthrized(...endPoints.profile),
	userServices.profile
);

// update profile
router.patch(
	"/updateProfile",
	isAuthenticated,
	isAuthrized(...endPoints.updateProfile),
	validation(userValidation.updateProfile),
	userServices.updateProfile
);
router.get("/verify-email/:token", userServices.verifyEmail);
// upddate Email
router.patch(
	"/update-email",
	isAuthenticated,
	isAuthrized(...endPoints.updateEmail),
	validation(userValidation.updateEmail),
	userServices.updateEmail
);
// update password
router.patch(
	"/updatePassword",
	isAuthenticated,
	isAuthrized(...endPoints.updatePassword),
	validation(userValidation.updatePassword),
	userServices.updatePassword
);
// deactive account
router.delete(
	"/deactiveAccount",
	isAuthenticated,
	isAuthrized(...endPoints.deactiveAccount),
	validation(userValidation.deactiveAccount),
	userServices.deactiveAccount
);

// forget password
router.post(
	"/forgetPassword",
	isAuthenticated,
	isAuthrized(...endPoints.forgotPassword),
	validation(userValidation.forgetPassword),
	userServices.forgetPassword
);

// reset password
router.post(
	"/resetPassword/",
	isAuthenticated,
	isAuthrized(...endPoints.resetPassword),
	validation(userValidation.resetPassword),
	userServices.resetPassword
);

// add profile picture
router.post(
	"/Profile-picture",
	isAuthenticated,
	upload(fileValidation.images, folderNames.profilePics).single("image"), // return middleware
	userServices.ProfilePicture
);
router.post(
	"/Profile-pic-cloud",
	isAuthenticated,
	cloudUpload().single("image"), // return middleware
	userServices.ProfilePictureCloud
);
router.delete("/del-profile-pic", isAuthenticated, userServices.delProfilePic);
router.delete(
	"/del-profilepic-cloud",
	isAuthenticated,
	userServices.delProfilePicCloud
);

router.post(
	"/cover-picture",
	isAuthenticated,
	upload(fileValidation.images, folderNames.coverPics).array("cover-images"),
	userServices.Coverpicture
);

router.post(
	"/test-field",
	isAuthenticated,
	upload(fileValidation.images, folderNames.fieldPics).fields([
		{ name: "babies", maxCount: 2 },
		{ name: "men", maxCount: 3 },
	]),
	(req, res) => {
		return res.json({ files: req.files });
	}
);
export default router;
