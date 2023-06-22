const User = require("../models/user");

const AuthController = {
	handleSignUp: async (req, res, next) => {
		try {
			const user = new User({
				username: req.body.userName,
				email: req.body.email,
				password: req.body.password,
			});
			const result = await user.save();
			res.status(201).json({ message: "Sign Up successfull" });
		} catch (error) {
			res.status(404).json({
				message: "Some Error occured during sign up",
			});
			return next(error);
		}
	},
};

module.exports = AuthController;
