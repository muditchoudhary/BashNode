import express from "express";

import { AuthController } from "../controllers/Auth.controller.js";
import { AuthValidation } from "../validators/Auth.validation.js";

export const loadAuthRoutes = (
	contoller = AuthController,
	validator = AuthValidation
) => {
	const router = express.Router();

	const { handleSignUp, handleSignIn } = contoller();
	const { signUpValidate, signInValidate } = validator();

	router.post("/sign-up", signUpValidate(), handleSignUp);
	router.post("/sign-in", signInValidate(), handleSignIn);

	return router;
};
