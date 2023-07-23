import mongoose from "mongoose";

const { Schema } = mongoose;

const BlogDraftSchema = new Schema({
	title: {
		type: String,
		required: true,
		default: "",
	},
	content: {
		type: String,
		required: true,
		default: "",
	},
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
		required: true,
	},
	created_at: {
		type: Date,
		required: true,
		default: Date.now,
	},
	updated_at: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

const BlogDraft = mongoose.model("blogDraft", BlogDraftSchema);
export default BlogDraft;
