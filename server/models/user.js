import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const { Schema } = mongoose;

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

const usersDB = mongoose.connection.useDb("users_db");
const User = usersDB.model("user", UserSchema);

export default User;
