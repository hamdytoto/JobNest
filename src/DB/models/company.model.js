import { Types, Schema, model } from "mongoose";
import {numberOfEmployees} from "./eumsValues/company.enum.js"
const companySchema = new Schema(
	{
		companyName: { type: String, required: true, unique: true },
		description: { type: String, required: true },
		industry: { type: String, required: true },
		address: { type: String, required: true },
		numberOfEmployees: {
			type: String,
			required: true,
			enum: Object.values(numberOfEmployees),
		},
		companyEmail: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		createdBy: { type: Types.ObjectId, ref: "User", required: true },
		logo: {
			secure_url: { type: String, default: null },
			public_id: { type: String, default: null },
		},
		coverPic: {
			secure_url: { type: String, default: null },
			public_id: { type: String, default: null },
		},
		HRs: [{ type: Types.ObjectId, ref: "User" }],
		bannedAt: { type: Date, default: null },
		deletedAt: { type: Date, default: null },
		legalAttachment: {
			secure_url: { type: String, default: null },
			public_id: { type: String, default: null },
		},
		approvedByAdmin: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

const Company = model("Company", companySchema);
export default Company;
