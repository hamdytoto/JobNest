import { Router } from "express";
import isAuthenticated from "../../middlewares/auth.middleware.js";
import isAuthrized from "../../middlewares/authrazation.middleware.js";
import endPoints from "../post/post.endPoints.js";
import { cloudUpload } from "../../utils/fileUploading/cloud.multer.js";
import * as postServices from "./post.services.js";
import * as postValidation from "./post.validation.js";
import validation from "../../middlewares/validation.middleware.js";
import commentRouter from "../comment/comment.controller.js";

const router = Router();
router.use("/:postId/comment", commentRouter); // redirect to comment router
// create Post
router.post(
	"/",
	isAuthenticated,
	isAuthrized(...endPoints.createPost),
	cloudUpload().array("images"),
	validation(postValidation.createPost),
	postServices.createPost
);
router.patch(
	"/:id",
	isAuthenticated,
	isAuthrized(...endPoints.updatePost),
	cloudUpload().array("images"),
	validation(postValidation.updatePost),
	postServices.updatePost
);
router.delete(
	"/:id/freeze",
	isAuthenticated,
	isAuthrized(...endPoints.SoftDeletePost),
	validation(postValidation.SoftDeletePost),
	postServices.SoftDeletePost
);
router.patch(
	"/:id/restore",
	isAuthenticated,
	isAuthrized(...endPoints.restorePost),
	validation(postValidation.restorePost),
	postServices.restorePost
);
router.get(
	"/:id",
	isAuthenticated,
	isAuthrized(...endPoints.getSinglePost),
	validation(postValidation.getSinglePost),
	postServices.getSinglePost
);
router.get(
	"/all/activeposts",
	isAuthenticated,
	isAuthrized(...endPoints.getActivePosts),
	postServices.getActivePosts
);
router.get(
	"/all/archivedposts",
	isAuthenticated,
	isAuthrized(...endPoints.archivedPosts),
	postServices.archivedPosts
);

// like,unlike
router.patch(
	"/:id/like-unlike",
	isAuthenticated,
	isAuthrized(...endPoints.likeUnlikePost),
	validation(postValidation.likeUnlikePost),
	postServices.likeUnlikePost
);

export default router;
