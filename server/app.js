import express from "express";
import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
import cors from "cors";

import { loadAuthRoutes } from "./routes/Auth.routes.js";
import { loadDraftRoutes } from "./routes/Draft.routes.js";
import { AuthController } from "./controllers/Auth.controller.js";
import { intializePassport } from "./config/passport.config.js";

const { authenticateUser } = AuthController();

dotenv.config();
const PORT = process.env.PORT || 3000;

const AUTH_ROUTE_PREFIX = "/auth";
const BLOG_ROUTE_PREFIX = "/blog";

const draftRouter = loadDraftRoutes();
const authRouther = loadAuthRoutes();

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

intializePassport(passport, JwtStrategy, ExtractJwt, authenticateUser);

app.use(passport.initialize());

app.use(express.urlencoded({ extended: false }));

app.use(AUTH_ROUTE_PREFIX, authRouther);
app.use(BLOG_ROUTE_PREFIX, draftRouter);

app.listen(PORT, () => {
	console.log(`Server started at port ${PORT}`);
});
