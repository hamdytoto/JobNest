import { Router } from "express";
import isAuthenticated from "../../middlewares/auth.middleware.js";
import isAuthrized from "../../middlewares/authrazation.middleware.js";
import endPoints from "../job/job.endPoints.js";
import { cloudUpload } from "../../utils/fileUploading/cloud.multer.js";
import * as jobServices from "./job.services.js";
import * as jobValidation from "./job.validation.js";
import validation from "../../middlewares/validation.middleware.js";

const router = Router({ mergeParams: true });
// create job
router.post(
	"/add",
	isAuthenticated,
	isAuthrized(...endPoints.createJob),
	validation(jobValidation.createJob),
	jobServices.createJob
);
// update job
router.patch(
	"/:id/update",
	isAuthenticated,
	isAuthrized(...endPoints.updateJob),
	validation(jobValidation.updateJob),
	jobServices.updateJob
);
router.delete(
	"/:id/delete",
	isAuthenticated,
	isAuthrized(...endPoints.deleteJob),
	validation(jobValidation.deleteJob),
	jobServices.deleteJob
);
router.get(
	"/all/:jobId?", /// merging params   ?mark make it optional
	isAuthenticated,
	isAuthrized(...endPoints.getJobs),
	validation(jobValidation.getJobs),
	jobServices.getJobs
);

// get filtered jobs
router.get(
	"/filter",
	isAuthenticated,
	isAuthrized(...endPoints.getFilteredJobs),
	jobServices.getFilteredJobs
);

// get job applications
router.get(
	"/applications/:jobId",
	isAuthenticated,
	isAuthrized(...endPoints.getJobApplications),
	validation(jobValidation.getJobApplications),
	jobServices.getJobApplications
);

// apply for job 
router.post(
	"/apply/:jobId",
	isAuthenticated,
	isAuthrized(...endPoints.applyForJob),
	cloudUpload().single("userCv"),
	validation(jobValidation.applyForJob),
	jobServices.applyForJob	
)

// accept or reject application
router.patch(
	"/applications/:jobId/:applicationId",
	isAuthenticated,
	isAuthrized(...endPoints.acceptOrRejectApplication),
	validation(jobValidation.acceptOrRejectApplication),
	jobServices.acceptOrRejectApplicant
)


export default router;
