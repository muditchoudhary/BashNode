import express from "express";

import { AuthController } from "../controllers/Auth.controller.js";
import { AuthValidation } from "../validators/Auth.validation.js";

const SIGN_UP_PATH = "/sign-up";
const SIGN_IN_PATH = "/sign-in";

export const loadAuthRoutes = (
	controller = AuthController,
	validator = AuthValidation
) => {
	const router = express.Router();

	const { handleSignUp, handleSignIn } = controller();
	const { signUpValidate, signInValidate } = validator();

	router.post(SIGN_UP_PATH, signUpValidate(), handleSignUp);
	router.post(SIGN_IN_PATH, signInValidate(), handleSignIn);

	return router;
};
