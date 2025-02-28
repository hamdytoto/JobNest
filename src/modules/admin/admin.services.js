import User from "../../DB/models/user.model.js";
import Company from "../../DB/models/company.model.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
// Ban or Unban a User
export const banOrUnbanUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) return next(new Error("User not found"));

    // Toggle banned status
    user.bannedAt = user.bannedAt ? null : new Date();
    await user.save();

    res.status(200).json({
        success: true,
        message: `User ${user.bannedAt ? "banned" : "unbanned"} successfully`,
    });
});

//  Ban or Unban a Company
export const banOrUnbanCompany = asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;
    const company = await Company.findById(companyId);

    if (!company) return next(new Error("Company not found"));

    // Toggle banned status
    company.bannedAt = company.bannedAt ? null : new Date();
    await company.save();

    res.status(200).json({
        success: true,
        message: `Company ${company.bannedAt ? "banned" : "unbanned"} successfully`,
    });
});

//  Approve a Company
export const approveCompany = asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;
    const company = await Company.findById(companyId);

    if (!company) return next(new Error("Company not found"));

    // Mark as approved
    company.approvedByAdmin = true;
    await company.save();

    res.status(200).json({
        success: true,
        message: "Company approved successfully",
    });
});
