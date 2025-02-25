import { Schema, Types, model } from "mongoose";
import { hash } from "../../utils/hashing/hash.js";
import { providers, genders, roles, otpTypes } from "./eumsValues/user.enum.js";
import { encrypt } from "../../utils/encryption/encryption.js";
const userSchema = new Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true, unique: true, lowercase: true },
		password: { type: String, required: true },
		provider: {
			type: String,
			enum: Object.values(providers),
			default: providers.system,
		},
		gender: { type: String, enum: Object.values(genders), required: true },
		DOB: {
			type: Date,
			required: true,
			validate: {
				validator: function (value) {
					const today = new Date();
					const age = today.getFullYear() - value.getFullYear();
					return age >= 18;
				},
				message: "User must be at least 18 years old.",
			},
		},
		mobileNumber: { type: String, required: true },
		role: { type: String, enum: Object.values(roles), default: roles.user },
		isConfirmed: { type: Boolean, default: false },
		deletedAt: { type: Date, default: null },
		bannedAt: { type: Date, default: null },
		updatedBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
		changeCredentialTime: { type: Date, default: null },
		profilePic: {
			secure_url: { type: String, default: null },
			public_id: { type: String, default: null },
		},
		coverPic: {
			secure_url: { type: String, default: null },
			public_id: { type: String, default: null },
		},
		OTP: [
			{
				code: { type: String, required: true },
				type: { type: String, enum: Object.values(otpTypes), required: true },
				expiresIn: { type: Date, required: true },
			},
		],
	},
	{ timestamps: true }
);

// Virtual field for username
userSchema.virtual("username").get(function () {
	return `${this.firstName} ${this.lastName}`;
});

// Hash password before saving
userSchema.pre("save",  function (next) {
	if (this.isModified("password")) {
		this.password =  hash({ plainText: this.password });
	}
	if (this.isModified("mobileNumber")) {
		this.mobileNumber =  encrypt({ plainText: this.mobileNumber });
	}
	return next();
});

const User = model("User", userSchema);

export default User;