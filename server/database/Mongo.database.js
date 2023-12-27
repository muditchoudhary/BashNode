import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const BLOGSDB_URI = process.env.BLOGSDB_URI;
const USERSDB_URI = process.env.USERSDB_URI;

export const connectDBs = () => {
    try {
        const usersDB = mongoose.createConnection(USERSDB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const blogsDB = mongoose.createConnection(BLOGSDB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });

        usersDB.on("connected", () => {
            console.log("UsersDB connection successful");
        });

        blogsDB.on("connected", () => {
            console.log("BlogsDB connection successful");
        });

        return { usersDB, blogsDB };
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
};