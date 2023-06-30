import passport from "passport";
import User from "../models/user.js";
import { validationResult } from "express-validator";
const AuthController = {
	handleSignUp: async (req, res, next) => {
		const { email } = req.body;

		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(409).json({ errors: errors.array() });
			}

			// checking for existing user
			const existingUser = await User.findOne({ email });
			if (existingUser) {
				return res.status(409).json({
					errors: { msg: "Email is already taken", path: "email" },
				});
			}

			// add the user to database
			const user = new User({
				username: req.body.name,
				email: req.body.email,
				password: req.body.password,
			});
			const result = await user.save();
			res.status(201).json({ message: "Sign Up successful" });
		} catch (error) {
			res.status(500).json({
				error: "Internal Server Error",
			});
			return next(error);
		}
	},

	handleSignIn: (req, res, next) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(409).json({ errors: errors.array() });
			} else {
				passport.authenticate("local", (err, user, info) => {
					if (err) {
						return next(err);
					}
					if (!user) {
						// Authentication failed
						return res
							.status(401)
							.json({ message: "Authentication failed" });
					}
					// Authentication succeeded

					return res
						.status(200)
						.json({ message: "Authentication successful" });
				})(req, res, next);
			}
		} catch (error) {
			res.status(500).json({
				error: "Internal Server Error",
			});
			return next(error);
		}
	},

	authenticateUser: async (email, password, done) => {
		try {
			const user = await User.findOne({ email: email });
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
	},
};

export default AuthController;
