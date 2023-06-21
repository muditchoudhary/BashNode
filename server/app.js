const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const dotenv = require("dotenv").config();
const User = require("./models/user");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_ID = process.env.SESSION_ID;

mongoose.connect(MONGODB_URI, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

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
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await User.findOne({ email: username });
			if (!user) {
				return done(null, false, { message: "Incorrect email" });
			}
			if (user.password !== password) {
				return done(null, false, { message: "Incorrect password" });
			}
			return done(null, user);
		} catch (err) {
			return done(err);
		}
	})
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
