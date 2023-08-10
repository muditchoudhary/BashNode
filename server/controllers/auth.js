import passport from "passport";
import { validationResult } from "express-validator";
import dotenv from "dotenv";

import { UserModel } from "../models/User.model.js";
import { handleServerError, createToken } from "./authHelper.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const AuthController = () => {
	const handleSignUp = async (req, res, next) => {
		const { name, email, password } = req.body;

		try {
			const errors = validationResult(req);
			if (!errors.isEmpty())
				return res.status(400).json({ errors: errors.array() });

			const existingUser = await UserModel.findOne({ email });
			if (existingUser) {
				return res.status(409).json({
					errors: [{ msg: "Email is already taken", path: "email" }],
				});
			}

			const user = new UserModel({
				username: name,
				email: email,
				password: password,
			});
			const result = await user.save();

			const token = createToken(user._id);
			return res.status(200).json({ email, token });
		} catch (error) {
			console.error("Error in handleSignUp:\n\n", error);
			handleServerError(res, next, "Internal Server Error");
		}
	};

	const handleSignIn = (req, res, next) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			passport.authenticate("local", (err, user, info) => {
				if (err) {
					console.error("Error in handleSignIn:\n\n", err);
					return handleServerError(
						res,
						next,
						"Some internal passport authentication error occurred"
					);
				}
				if (!user) {
					return res
						.status(401)
						.json({ message: "Authentication failed" });
				}

				req.login(user, (err) => {
					if (err) {
						console.error("Error in handleSignIn:\n\n", err);
						return handleServerError(
							res,
							next,
							"Session save went bed"
						);
					}

					const token = createToken(user._id);

					return res.status(200).json({
						email: user.email,
						token,
					});
				});
			})(req, res, next);
		} catch (error) {
			console.error("Error in handleSignIn:\n\n", error);
			handleServerError(res, next, "Internal Server Error");
		}
	};

	const authenticateUser = async (email, password, done) => {
		try {
			const user = await UserModel.findOne({ email: email });
			if (!user) {
				return done(null, false, { message: "Incorrect email" });
			}
			if (user.password !== password) {
				return done(null, false, { message: "Incorrect password" });
			}
			return done(null, user);
		} catch (err) {
			console.error("Error in authenticateUser:\n\n", err);
			return done(err);
		}
	};

	return { authenticateUser, handleSignIn, handleSignUp };
};

export default AuthController;
