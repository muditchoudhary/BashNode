import mongoose from "mongoose";

import { connectDBs } from "../database/Mongo.database.js";

const { Schema } = mongoose;
const { blogsDB } = connectDBs();

const DraftSchema = new Schema({
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

export const DraftModel = await blogsDB.model("Draft", DraftSchema);
