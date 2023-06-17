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
			res.redirect("/");
			console.log("success");
		} catch (error) {
			return next(err);
		}
	},
};

module.exports = AuthController;
