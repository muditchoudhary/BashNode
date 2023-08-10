import mongoose from "mongoose";
import { Schema } from "mongoose";

export const PublishedBlogSchema = new Schema({
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
	published_at: {
		type: Date,
		default: Date.now,
	},
	updated_at: {
		type: Date,
		default: Date.now,
	},
});
