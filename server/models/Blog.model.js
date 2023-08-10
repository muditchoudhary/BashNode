import mongoose from "mongoose";
import dotenv from "dotenv";

import { DraftSchema } from "../schemas/BlogDraft.schema.js";
import { PublishedBlogSchema } from "../schemas/PublishedBlog.schema.js";

dotenv.config();

const BLOGSDB_URI = process.env.BLOGSDB_URI;

const blogsDBConnection = mongoose.createConnection(BLOGSDB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

export const DraftModel = blogsDBConnection.model("Draft", DraftSchema);
export const PublishedBlogModel = blogsDBConnection.model(
	"PublishedBlog",
	PublishedBlogSchema
);
