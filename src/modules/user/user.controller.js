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
	"/update_profile",
	isAuthenticated,
	isAuthrized(...endPoints.updateProfile),
	validation(userValidation.updateProfile),
	userServices.updateProfile
);
// show profile anthor user
router.get(
	"/profile_user/:userId",
	isAuthenticated,
	isAuthrized(...endPoints.profileUser),
	validation(userValidation.profileUser),
	userServices.profileUser
);

// update password
router.patch(
	"/update_password",
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
