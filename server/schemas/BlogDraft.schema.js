import mongoose from "mongoose";
const { Schema } = mongoose;

export const DraftSchema = new Schema({
	title: {
		type: String,
		default: "",
	},
	content: {
		type: String,
		default: "",
	},
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "users",
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
	updated_at: {
		type: Date,
		default: Date.now,
	},
});
