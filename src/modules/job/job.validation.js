import joi from "joi";
import {
	fileObject,
	isvalidObjectId,
} from "../../middlewares/validation.middleware.js";
import {
	joblocation,
	senioritylevel,
	workingtime,
} from "../../DB/models/eumsValues/job.enum.js";
import { statusTypes } from "../../DB/models/eumsValues/application.enum.js";

export const createJob = joi.object({
	jobTitle: joi.string().required(),
	jobLocation: joi
		.string()
		.valid(...Object.values(joblocation))
		.required(),
	workingTime: joi
		.string()
		.valid(...Object.values(workingtime))
		.required(),
	seniorityLevel: joi
		.string()
		.valid(...Object.values(senioritylevel))
		.required(),
	jobDescription: joi.string().required(),
	technicalSkills: joi.array().items(joi.string()).required(),
	softSkills: joi.array().items(joi.string()).required(),
	companyId: joi.custom(isvalidObjectId).required(),
});

export const updateJob = joi.object({
	id: joi.custom(isvalidObjectId).required(),
	jobTitle: joi.string().required(),
	jobLocation: joi
		.string()
		.valid(...Object.values(joblocation))
		.required(),
	workingTime: joi
		.string()
		.valid(...Object.values(workingtime))
		.required(),
	seniorityLevel: joi
		.string()
		.valid(...Object.values(senioritylevel))
		.required(),
	jobDescription: joi.string().required(),
	technicalSkills: joi.array().items(joi.string()).required(),
	softSkills: joi.array().items(joi.string()).required(),
});

export const deleteJob = joi.object({
	id: joi.custom(isvalidObjectId).required(),
});
export const getJobs = joi.object({
	companyId: joi.custom(isvalidObjectId).required(),
	jobId: joi.custom(isvalidObjectId).optional(),
});

export const applyForJob = joi.object({
	jobId: joi.custom(isvalidObjectId).required(),
	file: joi.object(fileObject).required(),
});
export const getJobApplications = joi.object({
	jobId: joi.custom(isvalidObjectId).required(),
});
export const acceptOrRejectApplication = joi.object({
	applicationId: joi.custom(isvalidObjectId).required(),
	jobId: joi.custom(isvalidObjectId).required(),
	status: joi
		.string()
		.valid(statusTypes.accepted, statusTypes.rejected)
		.required(),
});
