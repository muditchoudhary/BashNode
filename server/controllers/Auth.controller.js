import { validationResult, matchedData } from "express-validator";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { UserModel } from "../models/User.model.js";
import { SERVER_RESPONSES } from "../globalConstants/constants.js";
import { JSON_TOKEN_EXPIRATION_TIME } from "../globalConstants/constants.js";
import { SALT_ROUNDS } from "../globalConstants/constants.js";

dotenv.config();

const STATUS_VALIDATION_CONFLICT = 409;
const STATUS_OK = 200;
const STATUS_INTERNAL_SERVER_ERROR = 500;

export const AuthController = (userModel = UserModel) => {
	/**
	 * If no validation errors, create a new user and save it to the database.
	 */
	const handleSignUp = async (req, res) => {
		try {
			const validationErrors = validationResult(req);
			if (!validationErrors.isEmpty()) {
				return res.status(SERVER_RESPONSES.VALIDATION_CONFLICT).json({
					success: false,
					validationErrors: validationErrors.mapped(),
				});
			}

			const data = matchedData(req);

			const user = new userModel({
				username: data.username,
				email: data.email,
				password: await bcrypt.hash(data.password, SALT_ROUNDS),
			});
			const result = await user.save();

			const payload = { id: result._id };
			const token = jwt.sign(payload, process.env.JWT_SECRET, {
				expiresIn: JSON_TOKEN_EXPIRATION_TIME,
			});
			return res
				.status(SERVER_RESPONSES.OK)
				.json({ success: true, token });
		} catch (error) {
			console.error(error);
			res.status(SERVER_RESPONSES.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: "Internal Server Error",
			});
		}
	};

	/**
	 * If no validation errors, check if the user exists and password is correct.
	 * Then, create a new token and send it to the client.
	 */
	const handleSignIn = async (req, res) => {
		try {
			const validationErrors = validationResult(req);
			if (!validationErrors.isEmpty()) {
				return res.status(SERVER_RESPONSES.VALIDATION_CONFLICT).json({
					success: false,
					validationErrors: validationErrors.mapped(),
				});
			}

			const data = matchedData(req);

			const user = await userModel.findOne({ email: data.email });

			if (!user) {
				return res.status(SERVER_RESPONSES.VALIDATION_CONFLICT).json({
					success: false,
					validationErrors: {
						email: {
							msg: "No user found with this email",
						},
					},
				});
			}

			const isPasswordMatch = await bcrypt.compare(
				data.password,
				user.password
			);

			if (!isPasswordMatch) {
				return res.status(SERVER_RESPONSES.VALIDATION_CONFLICT).json({
					success: false,
					validationErrors: {
						password: {
							msg: "Password is incorrect",
						},
					},
				});
			}

			const payload = { id: user._id };
			const token = jwt.sign(payload, process.env.JWT_SECRET, {
				expiresIn: JSON_TOKEN_EXPIRATION_TIME,
			});
			return res
				.status(SERVER_RESPONSES.OK)
				.json({ success: true, token });
		} catch (error) {
			console.error(error);
			res.status(SERVER_RESPONSES.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: "Internal Server errors",
			});
		}
	};

	/**
	 * Authenticate the user by checking if the user exists in the database.
	 * Method used by passport.js internally.
	 * Used when authenicated requests are made to the server.
	 */
	const authenticateUser = async (jwt_payload, done) => {
		try {
			const user = await userModel.findOne({ _id: jwt_payload.id });
			if (!user) {
				return done(null, false, { message: "User not found" });
			}
			return done(null, user);
		} catch (err) {
			console.error(err);
			return done(err);
		}
	};

	return { authenticateUser, handleSignIn, handleSignUp };
};
