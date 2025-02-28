import { Router } from "express";
import isAuthenticated from "../../middlewares/auth.middleware.js";
import isAuthrized from "../../middlewares/authrazation.middleware.js";
import * as companyServices from "./company.services.js";
import * as companyValidation from "./company.validation.js";
import { cloudUpload } from "../../utils/fileUploading/cloud.multer.js";
import validation from "../../middlewares/validation.middleware.js";
import companyEndPoint from "./company.endpoint.js";
import jobRouter from "../job/job.controller.js"
const router = Router();
router.post(
	"/add",
	isAuthenticated,
	isAuthrized(...companyEndPoint.createCompany),
	cloudUpload().single("attachment"),
	validation(companyValidation.createCompany),
	companyServices.createCompany
);
router.patch(
	"/update/:id",
	isAuthenticated,
	isAuthrized(...companyEndPoint.updateCompany),
	cloudUpload().single("attachment"),
	validation(companyValidation.updateCompany),
	companyServices.updateCompany
);
router.delete(
	"/:id",
	isAuthenticated,
	isAuthrized(...companyEndPoint.deleteCompany),
	validation(companyValidation.deleteCompany),
	companyServices.softDeleteCompany
);
router.get(
	"/:id/jobs",
	isAuthenticated,
	isAuthrized(...companyEndPoint.getCompany),
	validation(companyValidation.getCompany),
	companyServices.getCompanyWithJobs
);

router.use("/:companyId",jobRouter)    ///  merge params

router.get(
	"/search",
	isAuthenticated,
	isAuthrized(...companyEndPoint.serachCompany),
	validation(companyValidation.searchCompany),
	companyServices.searchCompanyByName
);
// uploadlogo
router.post(
	"/:id/logo",
	isAuthenticated,
	isAuthrized(...companyEndPoint.uploadLogo),
	cloudUpload().single("image"),
	validation(companyValidation.uploadLogo),
	companyServices.uploadLogo
);
router.post(
	"/:id/cover-pic",
	isAuthenticated,
	isAuthrized(...companyEndPoint.uploadCover),
	cloudUpload().single("image"),
	validation(companyValidation.uploadCover),
	companyServices.uploadCover
);

// delete logo
router.delete(
	"/:id/logo",
	isAuthenticated,
	isAuthrized(...companyEndPoint.deleteLogo),
	validation(companyValidation.deleteLogo),
	companyServices.deleteLogo
)

// delete cover
router.delete(
	"/:id/cover-pic",
	isAuthenticated,
	isAuthrized(...companyEndPoint.deleteCover),
	validation(companyValidation.deleteCover),
	companyServices.deleteCover
)	


export default router;
