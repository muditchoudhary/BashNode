import User from "../models/user.js";
import Validation from "../utils/validation.js";

const AuthController = {
	handleSignUp: async (req, res, next) => {
		try {
			const user = new User({
				username: req.body.userName,
				email: req.body.email,
				password: req.body.password,
			});
			const result = await user.save();
			res.status(201).json({ message: "Sign Up successful" });
		} catch (error) {
			res.status(404).json({
				message: "Some Error occurred during sign up",
			});
			return next(error);
		}
	},
};

export default AuthController;
