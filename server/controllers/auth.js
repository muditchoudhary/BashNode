import passport from "passport";
import User from "../models/user.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const AuthController = (() => {
	/**
	 * If no validation erros && no existing user
	 * add the user credentials to database after sanitization
	 * @param {*} req
	 * @param {*} res
	 * @param {*} next
	 * @returns
	 */
	const handleSignUp = async (req, res, next) => {
		const { name, email, password } = req.body;

		try {
			// Checking for validation errors
			const errors = validationResult(req);
			if (!errors.isEmpty())
				return res.status(400).json({ errors: errors.array() });

			// Checking for existing user
			const existingUser = await User.findOne({ email });
			if (existingUser) {
				return res.status(400).json({
					errors: { msg: "Email is already taken", path: "email" },
				});
			}

			// otherwise add the user to database
			const user = new User({
				username: name,
				email: email,
				password: password,
			});
			const result = await user.save();

			// creating a jwt token
			const token = createToken(user._id);
			return res
				.status(201)
				.json({ message: "Sign Up successful", token });
		} catch (error) {
			// catch error during saving user on mongo
			res.status(500).json({
				error: "Internal Server Error",
			});
			return next(error);
		}
	};

	const handleSignIn = (req, res, next) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(409).json({ errors: errors.array() });
			}

			passport.authenticate("local", (err, user, info) => {
				if (err) {
					res.status(500).json({
						message: "Something went wrong authenticating user",
					});
					next(err);
					return;
				}
				if (!user) {
					// User not found! Authentication failed
					return res
						.status(401)
						.json({ message: "Authentication failed" });
				}

				// User found! Authentication sucdeed
				req.login(user, (err) => {
					if (err) {
						return res.status(500).json({
							message: "Session save went bad.",
						});
					}

					// Create a jwt token
					const token = createToken(user._id);

					return res.status(200).json({
						message: "Authentication successful",
						token,
					});
				});
			})(req, res, next);
		} catch (error) {
			res.status(500).json({
				error: "Internal Server Error",
			});
			return next(error);
		}
	};

	const authenticateUser = async (email, password, done) => {
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
	};

	/**
	 * Generate a jwt token
	 * @param {*} _id user id
	 * @returns jwt token
	 */
	const createToken = (_id) => {
		console.log(JWT_SECRET);
		return jwt.sign({ _id }, JWT_SECRET, { expiresIn: "3d" });
	};

	return { authenticateUser, handleSignIn, handleSignUp };
})();

export default AuthController;
