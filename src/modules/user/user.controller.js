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




// add profile picture
router.post(
	"/upload_profile_pic",
	isAuthenticated,
	cloudUpload().single("image"), // return middleware
	userServices.ProfilePictureCloud
);
// add cover picture
router.post(
	"/upload_cover_pic",
	isAuthenticated,
	cloudUpload().single("image"), // return middleware
	userServices.coverPictureCloud
);
// delete profile picture
router.delete(
	"/del_profile_pic",
	isAuthenticated,
	userServices.delProfilePicCloud
);
// delete cover picture
router.delete(
	"/del_cover_pic",
	isAuthenticated,
	userServices.delCoverPicCloud
);

// deactive account
router.delete(
	"/softDelete_account",
	isAuthenticated,
	isAuthrized(...endPoints.deactiveAccount),
	validation(userValidation.deactiveAccount),
	userServices.deactiveAccount
)


export default router;
