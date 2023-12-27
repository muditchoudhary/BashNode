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
    user_avatar: {
        type: String,
        default: "",
    },
    liked_blogs: {
        type: Array,
        default: [],
    },
});

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

export const UserModel = await usersDB.model("User", UserSchema);
