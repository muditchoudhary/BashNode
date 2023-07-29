import express from "express";
import AuthController from "../controllers/auth.js";
import Validation from "../utils/validation.js";

const router = express.Router();

const { signUpValidate, signInValidate } = Validation;
const { handleSignUp, handleSignIn } = AuthController();

router.post("/sign-up", signUpValidate(), handleSignUp);

router.post("/sign-in", signInValidate(), handleSignIn);

export default router;
