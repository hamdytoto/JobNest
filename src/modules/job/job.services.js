import { nanoid } from "nanoid";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

// import { roles } from "../../DB/models/user.model.js";
import Job from "../../DB/models/job.model.js";
import Company from "../../DB/models/company.model.js";
import User from "../../DB/models/user.model.js";
import Application from "../../DB/models/application.model.js";
import cloudinary from "../../utils/fileUploading/cloudinary.config.js";
import { acceptOrReject } from "../../utils/emails/email.event.js";

export const createJob = asyncHandler(async (req, res, next) => {
	const { companyId } = req.body;

	const company = await Company.findById(companyId);
	if (!company) return next(new Error("Company not found", { cause: 404 }));

	// Ensure only HRs or the owner can create a job
	const isAuthorized =
		company.createdBy.toString() === req.user._id.toString() ||
		company.HRs.includes(req.user._id);

	if (!isAuthorized) {
		return next(
			new Error("Unauthorized: Only the company owner or HR can add a job.", {
				cause: 403,
			})
		);
	}

	const newJob = await Job.create({ ...req.body, addedBy: req.user._id });
	res.status(201).json({
		success: true,
		message: "Job created successfully",
		results: newJob,
	});
});

export const updateJob = asyncHandler(async (req, res, next) => {
	const { id } = req.params;

	const job = await Job.findById(id);
	if (!job) return next(new Error("Job not found", { cause: 404 }));

	// Ensure only the job creator can update
	if (job.addedBy.toString() !== req.user._id.toString()) {
		return next(
			new Error("Unauthorized: Only the job creator can update this job.", {
				cause: 403,
			})
		);
	}

	Object.assign(job, req.body);
	await job.save();

	res
		.status(200)
		.json({ success: true, message: "Job updated successfully", results: job });
});

export const deleteJob = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const job = await Job.findById(id);
	if (!job) return next(new Error("Job not found", { cause: 404 }));

	// Find the related company
	const company = await Company.findById(job.companyId);
	if (!company)
		return next(new Error("Related company not found", { cause: 404 }));

	//  Ensure only HRs or the company owner can delete the job
	const isAuthorized =
		company.createdBy.toString() === req.user._id.toString() ||
		company.HRs.includes(req.user._id);

	if (!isAuthorized) {
		return next(
			new Error(
				"Unauthorized: Only the company owner or HR can delete this job.",
				{ cause: 403 }
			)
		);
	}

	const deletedJob = await job.deleteOne();

	res.status(200).json({
		success: true,
		message: "Job deleted successfully",
		results: deletedJob,
	});
});

export const getJobs = asyncHandler(async (req, res, next) => {
	const { companyId, jobId } = req.params;
	const { page = 1, limit = 10, sort = "-createdAt", companyName } = req.query;

	const filter = {};

	// Filter by specific company
	if (companyId) filter.companyId = companyId;

	// Search by Company Name
	if (companyName) {
		const company = await Company.findOne({
			companyName: { $regex: companyName, $options: "i" },
		});
		if (!company) return next(new Error("Company not found", { cause: 404 }));
		filter.companyId = company._id;
	}

	//Filter by specific Job
	if (jobId) filter._id = jobId;

	//  Get total count (for pagination)
	const totalCount = await Job.countDocuments(filter);

	// Fetch Jobs
	const jobs = await Job.find(filter)
		.populate("companyId", "companyName") // Populate company name
		.sort(sort)
		.skip((page - 1) * limit)
		.limit(Number(limit));

	res.status(200).json({
		success: true,
		message: "Jobs fetched successfully",
		totalCount,
		currentPage: page,
		totalPages: Math.ceil(totalCount / limit),
		results: jobs,
	});
});

export const getFilteredJobs = asyncHandler(async (req, res, next) => {
	const { page = 1, limit = 10, sort = "-createdAt", ...filters } = req.query;

	// Build dynamic filter query
	const filter = {};
	if (filters.workingTime) filter.workingTime = filters.workingTime;
	if (filters.jobLocation) filter.jobLocation = filters.jobLocation;
	if (filters.seniorityLevel) filter.seniorityLevel = filters.seniorityLevel;
	if (filters.jobTitle)
		filter.jobTitle = { $regex: filters.jobTitle, $options: "i" }; // Case-insensitive
	if (filters.technicalSkills)
		filter.technicalSkills = { $in: filters.technicalSkills.split(",") }; // Array filter

	//  Get total count (for pagination)
	const totalCount = await Job.countDocuments(filter);

	// Fetch Jobs
	const jobs = await Job.find(filter)
		.populate("companyId", "companyName")
		.sort(sort)
		.skip((page - 1) * limit)
		.limit(Number(limit));

	res.status(200).json({
		success: true,
		totalCount,
		currentPage: page,
		totalPages: Math.ceil(totalCount / limit),
		results: jobs,
	});
});

export const applyForJob = asyncHandler(async (req, res, next) => {
	const { jobId } = req.params;
	const { _id } = req.user;
	const job = await Job.findById(jobId);
	if (!job) return next(new Error("Job not found", { cause: 404 }));
	console.log(req.file);
	const { secure_url, public_id } = await cloudinary.uploader.upload(
		req.file.path,
		{
			folder: `${process.env.CLOUD_FOLDER}/applications/${jobId}/${_id}`,
		}
	);
	const application = await Application.create({
		jobId,
		userId: _id,
		userCV: {
			secure_url,
			public_id,
		},
	});
	res.status(200).json({
		success: true,
		message: "Application submitted successfully",
		results: application,
	});
});

export const getJobApplications = asyncHandler(async (req, res, next) => {
	const { jobId } = req.params;
	const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

	const job = await Job.findById(jobId).populate({
		path: "applications",
		populate: [
			{ path: "userId", select: "firstName  email" },
			{ path: "jobId", select: "jobTitle" },
		], // Populate user data
	});

	if (!job) return next(new Error("Job not found", { cause: 404 }));

	//  Find the related company
	const company = await Company.findById(job.companyId);
	if (!company)
		return next(new Error("Related company not found", { cause: 404 }));

	// Ensure only HRs or the company owner can access applications
	const isAuthorized =
		company.createdBy.toString() === req.user._id.toString() ||
		company.HRs.includes(req.user._id);

	if (!isAuthorized) {
		return next(
			new Error(
				"Unauthorized: Only the company owner or HR can view applications.",
				{ cause: 403 }
			)
		);
	}

	// Get total applications count
	const totalCount = job.applications.length;

	// Paginate applications
	const paginatedApplications = job.applications
		.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sorting by createdAt
		.slice((page - 1) * limit, page * limit);

	res.status(200).json({
		success: true,
		totalCount,
		currentPage: page,
		totalPages: Math.ceil(totalCount / limit),
		results: paginatedApplications,
	});
});

export const acceptOrRejectApplicant = asyncHandler(async (req, res, next) => {
	const { jobId, applicationId } = req.params;
	console.log(jobId, applicationId);
	const { status } = req.body; 
	//  Find the job
	const job = await Job.findById(jobId).populate("companyId");
	if (!job) return next(new Error("Job not found", { cause: 404 }));

	//  Ensure the current user is an HR of this company
	const company = job.companyId;
	const isAuthorized = company.HRs.includes(req.user._id);

	if (!isAuthorized) {
		return next(
			new Error(
				"Unauthorized: Only company HR can accept/reject applications.",
				{ cause: 403 }
			)
		);
	}

	// Find the application
	const application = await Application.findOne({ _id: applicationId, jobId });
	if (!application)
		return next(
			new Error("Application not found for this job.", { cause: 404 })
		);

	//  Update the application status
	application.status = status;
	await application.save();

	//  Fetch applicant details
	const applicant = await User.findById(application.userId);
	if (!applicant)
		return next(new Error("Applicant not found.", { cause: 404 }));

	// Send email
	acceptOrReject.emit("sendMail", applicant.email, status, job.jobTitle, company.companyName);

	res.status(200).json({
		success: true,
		message: `Application ${status} successfully`,
		results: application,
	});
});
