import express from "express";
import passport from "passport";
import AuthController from "../controllers/auth.js";
import Validation from "../utils/validation.js";

const router = express.Router();

router.post("/sign-up", Validation.validate(), AuthController.handleSignUp);
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

export default router;