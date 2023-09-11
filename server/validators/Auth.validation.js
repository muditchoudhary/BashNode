import { body } from "express-validator";

import { UserModel } from "../models/User.model.js";

export const AuthValidation = (userModel = UserModel) => {
	const createUserNameChain = () => {
		return body("username")
			.trim()
			.notEmpty()
			.withMessage("must not be blank")
			.escape()
			.custom((value) => {
				if (value.length < 4) {
					throw new Error(
						"Username is too short (minimum is 4 characters)"
					);
				}
				if (value.length > 35) {
					throw new Error(
						"Username is too long (maximum is 35 characters)"
					);
				} else return true;
			});
	};
	const createSignUpEmailChain = () => {
		return body("email")
			.trim()
			.notEmpty()
			.withMessage("must not be blank")
			.escape()
			.isEmail()
			.withMessage("Please Enter A Valid Email!")
			.toLowerCase()
			.custom(async (value) => {
				const user = await userModel.findOne({ email: value });
				if (user) {
					throw new Error("Email is already taken");
				} else return true;
			});
	};
	const createSignInEmailChain = () => {
		return body("email")
			.trim()
			.notEmpty()
			.withMessage("must not be blank")
			.escape()
			.isEmail()
			.withMessage("Please Enter A Valid Email!")
			.toLowerCase();
	};
	const createSignUpPsasswordChain = () => {
		return body("password")
			.trim()
			.notEmpty()
			.withMessage("must not be blank")
			.escape()
			.isStrongPassword({
				minLength: 8,
				minLowercase: 1,
				minUppercase: 1,
				minNumbers: 1,
				minSymbols: 1,
			})
			.withMessage(
				"must be min 8 characters requires symbol, lowercase, uppercase, and number"
			)
			.custom((value) => {
				if (value.length < 8) {
					throw new Error(
						"Password is too short (minimum is 8 characters)"
					);
				}
				if (value.length > 16) {
					throw new Error(
						"Password is too long (maximum is 16 characters)"
					);
				} else return true;
			});
	};
	const createSignInPsasswordChain = () => {
		return body("password")
			.trim()
			.notEmpty()
			.withMessage("must not be blank")
			.escape();
	};

	const signUpValidate = () => {
		return [
			createUserNameChain(),
			createSignUpEmailChain(),
			createSignUpPsasswordChain(),
		];
	};

	const signInValidate = () => {
		return [createSignInEmailChain(), createSignInPsasswordChain()];
	};

	return { signUpValidate, signInValidate };
};
