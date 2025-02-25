import { Router } from "express";
import isAuthenticated from "./../../middlewares/auth.middleware.js";
import isAuthrized from "../../middlewares/authrazation.middleware.js";
import * as commentServices from "./comment.services.js";
import * as commentValidation from "./comment.validation.js";
import { cloudUpload } from "../../utils/fileUploading/cloud.multer.js";
import validation from "../../middlewares/validation.middleware.js";
import commentEndPoint from "./comment.endpoint.js";
const router = Router({ mergeParams: true });
router.post(
	"/",
	isAuthenticated,
	isAuthrized(...commentEndPoint.createComment),
	cloudUpload().single("images"),
	validation(commentValidation.createComment),
	commentServices.createComment
);
router.patch(
	"/:commentId",
	isAuthenticated,
	isAuthrized(...commentEndPoint.updateComment),
	cloudUpload().single("images"),
	validation(commentValidation.updateComment),
	commentServices.updateComment
);
router.delete(
	"/:commentId",
	isAuthenticated,
	isAuthrized(...commentEndPoint.deleteComment),
	validation(commentValidation.deleteComment),
	commentServices.deleteComment
);
router.get(
	"/:postId/comments",
	isAuthenticated,
	isAuthrized(...commentEndPoint.getComments),
	validation(commentValidation.getComments),
	commentServices.getComments
);
router.post(
	"/like-unlike/:commentId",
	isAuthenticated,
	isAuthrized(...commentEndPoint.likeUnlikeComment),
	validation(commentValidation.likeUnlikeComment),
	commentServices.likeUnlikeComment
);
router.post(
	"/:postId/comment/:commentId",
	isAuthenticated,
	isAuthrized(...commentEndPoint.replyComment),
	cloudUpload().single("images"),
	validation(commentValidation.replyComment),
	commentServices.addReply
);

router.delete(
	"/:postId/comment/:commentId",
isAuthenticated,
isAuthrized(...commentEndPoint.hardDelete),
validation(commentValidation.hardDelete),
commentServices.hardDelete
);

export default router;
