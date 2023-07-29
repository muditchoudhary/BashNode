import UserSchema from "../models/user.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const USERSDB_URI = process.env.USERSDB_URI;

const usersDBConnection = mongoose.createConnection(USERSDB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const UserModel = usersDBConnection.model("User", UserSchema);

export {usersDBConnection, UserModel};