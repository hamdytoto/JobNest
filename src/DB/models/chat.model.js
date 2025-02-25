import { Types, Schema, model } from "mongoose";

const messageSchema = new Schema(
	{
		senderId: {
			type: Types.ObjectId,
			ref: "User",
			required: true,
		},
		receiverId: {
			type: Types.ObjectId,
			ref: "User",
			required: true,
		},
		messages: [
			{
				message: { type: String, required: true },
				senderId: { type: Types.ObjectId, ref: "User", required: true },
				timestamp: { type: Date, default: Date.now },
			},
		],
	},
	{ timestamps: true }
);

const Message = model("Message", messageSchema);
export default Message;
