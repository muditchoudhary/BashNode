import express from "express";
import passport from "passport";

import { draftValidation } from "../validators/Draft.validation.js";
import { DraftController } from "../controllers/Draft.controller.js";

export const loadDraftRoutes = (
	controller = DraftController,
	validator = draftValidation
) => {
	const router = express.Router();
	const { getTitlesAndKeys, saveDraft } = controller();
	const { saveDraftValidate } = validator();

	router.get(
		"/draft",
		passport.authenticate("jwt", { session: false }),
		(req, res) => getTitlesAndKeys(req, res, req.user)
	);
	router.post(
		"/draft/save",
		passport.authenticate("jwt", { session: false }),
		saveDraftValidate(),
		(req, res) => saveDraft(req, res, req.user)
	);
	router.post("/draft/test", saveDraftValidate(), (req, res, next) => {
		const { email } = JSON.parse(req.headers.user);
		console.log(email);
		return res.status(200).json(req.headers.user);
	});

	return router;
};
