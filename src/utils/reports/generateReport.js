import Application from "../../DB/models/application.model.js";
import Job from "../../DB/models/job.model.js";
import Company from "../../DB/models/company.model.js";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import { asyncHandler } from "../errors/asyncHandler.js";

export const generateApplicationsReport = asyncHandler(
	async (req, res, next) => {
		const { companyId, date } = req.params;

		const company = await Company.findById(companyId);
		if (!company) return next(new Error("Company not found"));

		const jobs = await Job.find({ companyId }).select("_id");
		if (!jobs.length) return next(new Error("No jobs found for this company"));

		const jobIds = jobs.map((job) => job._id);

		// Parse date and filter applications
		const startDate = new Date(date);
		startDate.setHours(0, 0, 0, 0);
		const endDate = new Date(date);
		endDate.setHours(23, 59, 59, 999);

		const applications = await Application.find({
			jobId: { $in: jobIds },
			createdAt: { $gte: startDate, $lte: endDate },
		}).populate("userId", "firstName lastName email mobileNumber");

		if (applications.length === 0)
			return next(new Error("No applications found for this date"));

		// Ensure "uploads" folder exists
		const uploadDir = path.resolve("uploads");
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}

		// Create Excel Workbook & Sheet
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Applications");

		//  Add Header Row
		worksheet.addRow(["Full Name", "Email", "Mobile Number", "Applied At"]);

		//  Add Data Rows
		applications.forEach((app) => {
			worksheet.addRow([
				`${app.userId.firstName} ${app.userId.lastName}`,
				app.userId.email,
				app.userId.mobileNumber || "N/A",
				app.createdAt.toISOString(),
			]);
		});

		// Set Column Widths
		worksheet.columns = [
			{ width: 25 },
			{ width: 30 },
			{ width: 20 },
			{ width: 25 },
		];

		//  Save File Path
		const filePath = path.join(
			uploadDir,
			`applications_${companyId}_${date}.xlsx`
		);
		console.log("Saving file to:", filePath); // Debugging log

		//  Write File
		await workbook.xlsx.writeFile(filePath);
		console.log("File saved successfully:", filePath);

		//  Send File as Response
		res.download(filePath, `applications_${date}.xlsx`, (err) => {
			if (err) {
				console.error("Download error:", err);
				return next(err);
			}
			fs.unlinkSync(filePath); // Delete after sending
		});
	}
);
