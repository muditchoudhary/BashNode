import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export function createToken(_id) {
	return jwt.sign({ _id }, JWT_SECRET, { expiresIn: "3d" });
}

export function handleServerError(res, next, errorMessage) {
	res.status(500).json({
		error: errorMessage,
	});
	return next(new Error(errorMessage));
}

