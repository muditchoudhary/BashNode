const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth");

router.post("/sign-up", AuthController.handleSignUp);

module.exports = router;
