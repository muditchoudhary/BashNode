import express from "express";
import path from "path";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import dotenv from "dotenv";
import User from "./models/user.js";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import cors from "cors";
import { query, matchedData, validationResult } from "express-validator";
import AuthController from "./controllers/auth.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_ID = process.env.SESSION_ID;

// MONGO db setup
mongoose.connect(MONGODB_URI, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

// Express setup
const app = express();
app.use(cors());
app.use(express.json());

// app.use(express.static("dist"));
app.get("/", (req, res) => {
	res.send("Hello world!");
});

app.use(
	session({
		secret: SESSION_ID,
		resave: false,
		saveUninitialized: true,
	})
);

passport.use(
	new LocalStrategy(
		{ usernameField: "email" },
		AuthController.authenticateUser
	)
);

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (err) {
		done(err);
	}
});

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRoute);

// app.get("*", (req, res) => {
// 	res.sendFile(path.join(__dirname + "/dist/index.html"));
// });

app.listen(PORT, () => {
	console.log(`Server started at port ${PORT}`);
});