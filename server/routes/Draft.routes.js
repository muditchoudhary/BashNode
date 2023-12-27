import express from "express";
import passport from "passport";
import multer from "multer";

import { blogValidation } from "../validators/Blog.validation.js";
import { DraftController } from "../controllers/Draft.controller.js";
import { fileValidation } from "../validators/File.validation.js";
import { MAX_COVER_IMG_SIZE } from "../globalConstants/constants.js";
import { handleFileUpload } from "./fileOperations.js";

const SAVE_DRAFT_ROUTE = "/draft/save";
const GET_BLOGS_TITLES_AND_KEYS_ROUTE = "/getBlogsTitlesAndKeys";
const GET_DRAFT_ROUTE = "/draft/:draftId";
const PUBLISH_DRAFT_ROUTE = "/draft/publish";
const DELETE_DRAFT_ROUTE = "/draft/delete/:blogId";
const CREATE_NEW_DRAFT_ROUTE = "/draft/create";

export const loadDraftRoutes = (
	controller = DraftController,
	validator = blogValidation,
	fileValidator = fileValidation
) => {
	const router = express.Router();
	const { validateCoverImg } = fileValidator();
	const {
		getTitlesAndKeys,
		saveDraft,
		getDraft,
		publishDraft,
		deleteDraft,
		testDrafts,
		createNewDraft,
	} = controller();
	const { validateBlogData } = validator();

	const upload = multer({
		fileFilter: validateCoverImg,
		limits: {
			fileSize: MAX_COVER_IMG_SIZE,
		},
	});

	router.get(
		GET_BLOGS_TITLES_AND_KEYS_ROUTE,
		passport.authenticate("jwt", { session: false }),
		(req, res) => getTitlesAndKeys(req, res, req.user)
	);

	router.post(
		CREATE_NEW_DRAFT_ROUTE,
		passport.authenticate("jwt", { session: false }),
		(req, res) => {
			createNewDraft(req, res, req.user);
		}
	);

	router.put(
		SAVE_DRAFT_ROUTE,
		passport.authenticate("jwt", { session: false }),
		(req, res, next) => {
			handleFileUpload(req, res, next, upload, "coverImg");
		},
		validateBlogData(),
		(req, res) => saveDraft(req, res, req.user)
	);

	router.post(
		PUBLISH_DRAFT_ROUTE,
		passport.authenticate("jwt", { session: false }),
		(req, res, next) => {
			handleFileUpload(req, res, next, upload, "coverImg");
		},
		validateBlogData(),
		(req, res) => publishDraft(req, res, req.user)
	);

	router.post(
		"/fill/draft",
		passport.authenticate("jwt", { session: false }),
		(req, res) => {
			testDrafts(req, res, req.user);
		}
	);

	router.get(
		GET_DRAFT_ROUTE,
		passport.authenticate("jwt", { session: false }),
		(req, res) => {
			getDraft(req, res, req.user);
		}
	);
    
	router.delete(
		DELETE_DRAFT_ROUTE,
		passport.authenticate("jwt", { session: false }),
		(req, res) => {
			deleteDraft(req, res, req.user);
		}
	);

	return router;
};
