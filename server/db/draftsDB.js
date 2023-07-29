import mongoose from "mongoose";
import BlogDraftSchema from "../schemas/blogDraft.js";
import dotenv from "dotenv";

dotenv.config();

const BLOGSDB_URI = process.env.BLOGSDB_URI;

const draftsDBConnection = mongoose.createConnection(BLOGSDB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const DraftModel = draftsDBConnection.model("Draft", BlogDraftSchema);

export { draftsDBConnection, DraftModel };
