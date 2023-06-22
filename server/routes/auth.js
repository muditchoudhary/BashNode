const express = require("express");
const passport = require("passport");
const router = express.Router();
const AuthController = require("../controllers/auth");

router.post("/sign-up", AuthController.handleSignUp);
router.post(
	"/sign-in",
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/",
	}),
	(req, res, next) => {
		res.end();
	}
);

module.exports = router;
