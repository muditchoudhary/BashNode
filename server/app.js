import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import dotenv from "dotenv";
import authRoute from "./routes/auth.js";
import publishRoute from "./routes/publish.js";
import cors from "cors";
import AuthController from "./controllers/auth.js";
const { authenticateUser } = AuthController;

// Envrionment variable setup
dotenv.config();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;

// Express setup
const corsOptions = {
	origin: "http://localhost:5173",
	credentials: true,
};
const app = express();
app.use(cors(corsOptions));
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

passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));

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
app.use("/publish", publishRoute);

app.listen(PORT, () => {
	console.log(`Server started at port ${PORT}`);
});
