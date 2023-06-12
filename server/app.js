const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const dotenv = require("dotenv").config();
const User = require("./models/user");
const mongoose = require("mongoose");

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

app.set("views", __dirname);
app.set("view engine", "pug");

app.use(
	session({
		secret: SESSION_ID,
		resave: false,
		saveUninitialized: true,
	})
);

app.use(express.static("dist"));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.send("hello world"));

// app.get("/sign-up", (req, res) => res.send("sign up page"));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname + "/dist/index.html"));
});

app.listen(PORT, () => {
	console.log(`Server started at port ${PORT}`);
});
