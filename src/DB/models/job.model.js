import {Types,Schema,model} from "mongoose";
import {joblocation,workingtime,senioritylevel} from "./eumsValues/job.enum.js";
const jobSchema = new Schema(
  {
    jobTitle: { type: String, required: true },
    jobLocation: {
      type: String,
      enum: Object.values(joblocation),
      required: true,
    },
    workingTime: {
      type: String,
      enum: Object.values(workingtime),
      required: true,
    },
    seniorityLevel: {
      type: String,
      enum: Object.values(senioritylevel),
      required: true,
    },
    jobDescription: { type: String, required: true },
    technicalSkills: [{ type: String, required: true }],
    softSkills: [{ type: String, required: true }],
    addedBy: { type: Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Types.ObjectId, ref: "User", default: null },
    closed: { type: Boolean, default: false },
    companyId: { type: Types.ObjectId, ref: "Company", required: true },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
