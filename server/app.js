import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import dotenv from "dotenv";
import {intializePassport} from "./config/passportConfig.js";

import authRoute from "./routes/auth.js";
import {router as BlogRouter} from "./routes/Draft.routes.js"
import cors from "cors";
import AuthController from "./controllers/auth.js";
const { authenticateUser } = AuthController();

dotenv.config();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;
const AUTH_ROUTE_PREFIX = "/auth";
const PUBLISH_ROUTE_PREFIX = "/blog";

const CORS_OPTIONS = {
	origin: "http://localhost:5173",
	credentials: true,
};

const app = express();
app.use(cors(CORS_OPTIONS));
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Hello world!");
});

app.use(
	session({
		secret: SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
	})
);

intializePassport(passport, LocalStrategy, authenticateUser);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(AUTH_ROUTE_PREFIX, authRoute);
app.use(PUBLISH_ROUTE_PREFIX, BlogRouter);

app.listen(PORT, () => {
	console.log(`Server started at port ${PORT}`);
});
