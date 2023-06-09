import { body } from "express-validator";

const Validation = (() => {
	const createUserNameChain = () => {
		return body("name")
			.trim()
			.isLength({ min: 4 })
			.withMessage("is too short (minimum is 4 characters)")
			.notEmpty()
			.withMessage("must not be blank")
			.escape();
	};
	const createEmailChain = () => {
		return body("email")
			.trim()
			.isEmail()
			.withMessage("Please Enter A Valid Email!")
			.notEmpty()
			.withMessage("must not be blank")
			.toLowerCase()
			.escape();
	};
	const createPasswordChain = () => {
		return body("password")
			.trim()
			.isStrongPassword({
				minLength: 8,
				minLowercase: 1,
				minUppercase: 1,
				minNumbers: 1,
				minSymbols: 1,
			})
			.withMessage(
				"Password requires symbol, lowercase, uppercase, and number"
			)
			.notEmpty()
			.escape();
	};

	const signUpValidate = () => {
		return [
			createUserNameChain(),
			createEmailChain(),
			createPasswordChain(),
		];
	};

	const signInValidate = () => {
		return [createEmailChain(), createPasswordChain()];
	};

	return { signUpValidate, signInValidate };
})();
export default Validation;
