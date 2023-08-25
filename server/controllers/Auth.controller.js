import { validationResult, matchedData } from "express-validator";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { UserModel } from "../models/User.model.js";

dotenv.config();

export const AuthController = () => {
	const handleSignUp = async (req, res) => {
		try {
			const validationErrors = validationResult(req);
			if (!validationErrors.isEmpty()) {
				return res
					.status(400)
					.json({ validationErrors: validationErrors.mapped() });
			}

			const data = matchedData(req);
			const user = new UserModel({
				username: data.username,
				email: data.email,
				password: await bcrypt.hash(data.password, 10),
			});
			const result = await user.save();

			const payload = { id: result._id };
			const token = jwt.sign(payload, process.env.JWT_SECRET, {
				expiresIn: "1h",
			});
			return res.status(200).json({ email: result.email, token });
		} catch (error) {
			console.error("Error in handleSignUp:\n\n", error);
		}
	};

	const handleSignIn = async (req, res) => {
		try {
			const validationErrors = validationResult(req);
			if (!validationErrors.isEmpty()) {
				return res
					.status(400)
					.json({ validationErrors: validationErrors.mapped() });
			}
			const data = matchedData(req);
			const user = await UserModel.findOne({ email: data.email });

			if (!user) {
				return res.status(401).json({
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
				return res.status(401).json({
					validationErrors: {
						password: {
							msg: "Password is incorrect",
						},
					},
				});
			}

			const payload = { id: user._id };
			const token = jwt.sign(payload, process.env.JWT_SECRET, {
				expiresIn: "1h",
			});
			return res.status(200).json({ email: user.email, token });
		} catch (error) {
			console.error("Error in handleSignIn:\n\n", error);
		}
	};

	const authenticateUser = async (jwt_payload, done) => {
		try {
			const user = await UserModel.findOne({ _id: jwt_payload.id });
			if (!user) {
				return done(null, false, { message: "User not found" });
			}
			return done(null, user);
		} catch (err) {
			console.error("Error in authenticateUser:\n\n", err);
			return done(err);
		}
	};

	return { authenticateUser, handleSignIn, handleSignUp };
};
