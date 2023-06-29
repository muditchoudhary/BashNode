import User from "../models/user.js";
import { validationResult } from "express-validator";
const AuthController = {
	handleSignUp: async (req, res, next) => {
		const {email} = req.body;

		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

            // checking for existing user
			const existingUser = await User.findOne({email});
			if (existingUser) {
				return res.status(409).json({
					error: { msg: "Email is already taken", path: "email" },
				});
			}

			const user = new User({
				username: req.body.userName,
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
};

export default AuthController;
