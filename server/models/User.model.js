import mongoose from "mongoose";
import dotenv from "dotenv";

import {UserSchema} from "../schemas/User.schema.js";

dotenv.config();

const USERSDB_URI = process.env.USERSDB_URI;

const usersDBConnection = mongoose.createConnection(USERSDB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

export const UserModel = usersDBConnection.model("User", UserSchema);
