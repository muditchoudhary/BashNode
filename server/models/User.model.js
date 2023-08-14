import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

import { connectDBs } from "../database/Mongo.database.js";

const { Schema } = mongoose;
const { usersDB } = connectDBs();

const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
});

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

export const UserModel = usersDB.model("User", UserSchema);
