import express from "express";
import AuthController from "../controllers/auth.js";
import Validation from "../utils/validation.js";

const router = express.Router();

router.post("/sign-up", Validation.signUpValidate(), AuthController.handleSignUp);

router.post("/sign-in", Validation.signInValidate(), AuthController.handleSignIn);

export default router;
