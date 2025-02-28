import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import cloudinary from "../../utils/fileUploading/cloudinary.config.js";
import Company from "../../DB/models/company.model.js";
import { fieldNames, updateCompanyFile } from "./utils/uploadHelper.js";
export const createCompany = asyncHandler(async (req, res, next) => {
	const { companyName, companyEmail } = req.body;
	const existingCompany = await Company.findOne({
		$or: [{ companyName }, { companyEmail }],
	});
	if (existingCompany)
		return next(new Error("Company already exists", { cause: 400 }));

	const newCompany = await Company.create({
		...req.body,
		createdBy: req.user._id,
	});
	if (req.file) {
		const { secure_url, public_id } = await cloudinary.uploader.upload(
			req.file.path,
			{
				folder: `${process.env.CLOUD_FOLDER}/company/legalAttachment/${newCompany._id}`,
			}
		);
		newCompany.legalAttachment = { secure_url, public_id };
	}
	await newCompany.save();
	res.status(201).json({ success: true, results: { newCompany } });
});

export const updateCompany = asyncHandler(async (req, res, next) => {
	const { id } = req.params;

	const company = await Company.findById(id);
	if (!company) return next(new Error("Company not found", { cause: 404 }));

	// 🔹 Prevent unauthorized users from updating attachment
	if (req.file && company.createdBy.toString() !== req.user._id.toString()) {
		return next(
			new Error(
				"Unauthorized: Only the owner can update the attachment file.",
				{ cause: 403 }
			)
		);
	}

	if (req.file && company.createdBy.toString() === req.user._id.toString()) {
		// Delete old attachment if exists
		if (company.legalAttachment?.public_id) {
			await cloudinary.uploader.destroy(company.legalAttachment.public_id);
		}

		const { secure_url, public_id } = await cloudinary.uploader.upload(
			req.file.path,
			{
				folder: `${process.env.CLOUD_FOLDER}/company/legalAttachment/${company._id}`,
			}
		);

		company.legalAttachment = { secure_url, public_id };
	}

	//Update other allowed fields dynamically
	Object.keys(req.body).forEach((key) => {
		if (key !== "legalAttachment") {
			company[key] = req.body[key];
		}
	});

	await company.save();

	res.status(200).json({ success: true, results: { company } });
});

export const softDeleteCompany = asyncHandler(async (req, res, next) => {
	const { id } = req.params;

	const company = await Company.findById(id);
	if (!company) return next(new Error("Company not found", { cause: 404 }));

	//  Ensure only the owner or an admin can delete
	if (company.createdBy.toString() !== req.user._id.toString()) {
		return next(
			new Error(
				"Unauthorized: Only the owner or an admin can delete this company.",
				{ cause: 403 }
			)
		);
	}

	// Soft delete (set `deletedAt` to current timestamp)
	company.deletedAt = new Date();
	await company.save();

	res
		.status(200)
		.json({ success: true, message: "Company soft deleted successfully" });
});

export const getCompanyWithJobs = asyncHandler(async (req, res, next) => {
	const { id } = req.params;

	const company = await Company.findById(id).populate("jobs");

	if (!company) return next(new Error("Company not found", { cause: 404 }));

	res.status(200).json({ success: true, results: { company } });
});

export const searchCompanyByName = asyncHandler(async (req, res, next) => {
	const { name } = req.query;

	const companies = await Company.find({
		companyName: { $regex: new RegExp(name, "i") },
	}).select("companyName -_id");

	res.status(200).json({
		success: true,
		results: companies,
	});
});

export const uploadLogo = asyncHandler(async (req, res, next) => {
	await updateCompanyFile(req, res, next, fieldNames.logo);
});
export const uploadCover = asyncHandler(async (req, res, next) => {
	await updateCompanyFile(req, res, next, fieldNames.coverPic);
});
export const deleteLogo = asyncHandler(async (req, res, next) => {
	await updateCompanyFile(req, res, next, fieldNames.logo);
});
export const deleteCover = asyncHandler(async (req, res, next) => {
	await updateCompanyFile(req, res, next, fieldNames.coverPic);
});
