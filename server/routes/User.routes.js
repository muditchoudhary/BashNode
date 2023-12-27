import express from "express";
import passport from "passport";
import multer from "multer";

import { UserController } from "../controllers/User.controller.js";
import { handleFileUpload } from "./fileOperations.js";
import { fileValidation } from "../validators/File.validation.js";

const GET_USER_AVATAR_LIKES_ROUTE = "/get-user-avatar-likes";
const GET_USER_DETAILS_ROUTE = "/get-user-details";
const UPDATE_USER_AVATAR_ROUTE = "/update-user-avatar";
const MAX_AVATAR_IMG_SIZE = 1024 * 1024 * 5;

export const loadUserRoutes = (controller = UserController, fileValidator = fileValidation) => {
	const router = express.Router();
    const {validateCoverImg} = fileValidator();

    const upload = multer({
        fileFilter: validateCoverImg,
        limits: {
            fileSize: MAX_AVATAR_IMG_SIZE,
        },
    })

	const { getUserAvatarLikes, getUserDetails, updateAvatar } = controller();

	router.get(
		GET_USER_AVATAR_LIKES_ROUTE,
		passport.authenticate("jwt", { session: false }),
		(req, res) => {
			getUserAvatarLikes(req, res, req.user);
		}
	);

	router.get(
		GET_USER_DETAILS_ROUTE,
		passport.authenticate("jwt", { session: false }),
		(req, res) => {
			getUserDetails(req, res, req.user);
		}
	);

	router.put(
		UPDATE_USER_AVATAR_ROUTE,
		passport.authenticate("jwt", { session: false }),
        (req, res, next) => {
            handleFileUpload(req, res, next, upload, "avatar");
        },
        (req, res) => {
            updateAvatar(req, res, req.user);
        },
		
	);

	return router;
};
