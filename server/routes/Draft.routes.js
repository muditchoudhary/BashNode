import express from "express";
import passport from "passport";

import { draftValidation } from "../validators/Draft.validation.js";
import { DraftController } from "../controllers/Draft.controller.js";
import { get } from "mongoose";

export const loadDraftRoutes = (
	controller = DraftController,
	validator = draftValidation
) => {
	const router = express.Router();
	const {
		getTitlesAndKeys,
		saveDraft,
		getDraft,
		getPublishedBlogs,
		updatePublished,
		publishDraft,
		getPublishedBlogPosts,
		geTotalPublishedBlogs,
	} = controller();
	const { saveDraftValidate } = validator();

	router.get(
		"/getBlogsTitlesAndKeys",
		passport.authenticate("jwt", { session: false }),
		(req, res) => getTitlesAndKeys(req, res, req.user)
	);
	router.get(
		"/draft/:draftId",
		passport.authenticate("jwt", { session: false }),
		(req, res) => {
			getDraft(req, res, req.user);
		}
	);
	router.get(
		"/publish/:blogId",
		passport.authenticate("jwt", { session: false }),
		(req, res) => {
			getPublishedBlogs(req, res, req.user);
		}
	);
	router.post(
		"/draft/save",
		passport.authenticate("jwt", { session: false }),
		saveDraftValidate(),
		(req, res) => saveDraft(req, res, req.user)
	);
	router.post(
		"/publish/update",
		passport.authenticate("jwt", { session: false }),
		saveDraftValidate(),
		(req, res) => {
			updatePublished(req, res, req.user);
		}
	);
	router.post(
		"/draft/publish",
		passport.authenticate("jwt", { session: false }),
		saveDraftValidate(),
		(req, res) => {
			publishDraft(req, res, req.user);
		}
	);
	router.get(
		"/published/blogs",
		(req, res) => {
			getPublishedBlogPosts(req, res, req.user);
		}
	);
	router.get(
		"/totalPublishedBlogs",
		(req, res) => {
			geTotalPublishedBlogs(req, res, req.user);
		}
	);

	return router;
};
