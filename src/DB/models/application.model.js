import { Types, Schema, model } from "mongoose";
import { statusTypes } from "./eumsValues/application.enum.js";

const applicationSchema = new Schema(
	{
		jobId: { type: Types.ObjectId, ref: "Job", required: true },
		userId: { type: Types.ObjectId, ref: "User", required: true },
		userCV: {
			secure_url: { type: String, required: true },
			public_id: { type: String, required: true },
		},
		status: {
			type: String,
			enum: Object.values(statusTypes),
			default: "pending",
		},
	},
	{ timestamps: true }
);

const Application = model("Application", applicationSchema);
export default Application;
