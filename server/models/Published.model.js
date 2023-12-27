import mongoose from "mongoose";

import { connectDBs } from "../database/Mongo.database.js";

const { Schema } = mongoose;
const { blogsDB } = connectDBs();

const PublishedBlogSchema = new Schema({
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
	author_name: {
		type: String,
		default: "",
	},
	author_avatar: {
		type: String,
		default: "",
	},
	likes: {
		type: Number,
		default: 0,
	},
	cover_img: {
		type: String,
		default: "",
	},
});

export const PublishedBlogModel = await blogsDB.model(
	"PublishedBlog",
	PublishedBlogSchema
);
