import express from "express";
import passport from "passport";
import multer from "multer";

import { draftValidation } from "../validators/Draft.validation.js";
import { DraftController } from "../controllers/Draft.controller.js";
import { fileValidation } from "../validators/File.validation.js";

const fileValidator = fileValidation();
const { validateCoverImg } = fileValidator;

const upload = multer({
	fileFilter: validateCoverImg,
	limits: {
		fileSize: 10 * 1024 * 1024,
	},
});

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
		getSinglePublishedBlog,
		deleteDraft,
		deletePublishedBlog,
		testDrafts,
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
	router.put(
		"/draft/save",
		passport.authenticate("jwt", { session: false }),
		(req, res, next) => {
			upload.single("coverImg")(req, res, function (err) {
				if (err instanceof multer.MulterError) {
					return res
						.status(400)
						.json({ success: false, message: err.message });
				} else if (err) {
					// If the error is not an instance of multer.MulterError, it must be an error thrown by the validator.
					// If the err.message is undefined, it means that the error was from Internal server.
					// else the error was from the validator
					return err.message
						? res.status(400).json({
								success: false,
								message: err.message,
						  })
						: res.status(500).json({
								success: false,
								message: "Internal server error.",
						  });
				}

				next();
			});
		},
		saveDraftValidate(),
		(req, res) => saveDraft(req, res, req.user)
	);
	router.put(
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
	router.get("/published/blogs", (req, res) => {
		getPublishedBlogPosts(req, res, req.user);
	});
	router.get("/totalPublishedBlogs", (req, res) => {
		geTotalPublishedBlogs(req, res, req.user);
	});
	router.get("/getsingleBlog/:blogId", (req, res) => {
		getSinglePublishedBlog(req, res, req.user);
	});
	router.delete(
		"/draft/delete/",
		passport.authenticate("jwt", { session: false }),
		(req, res) => {
			deleteDraft(req, res, req.user);
		}
	);
	router.delete(
		"/publish/delete",
		passport.authenticate("jwt", { session: false }),
		(req, res) => {
			deletePublishedBlog(req, res, req.user);
		}
	);
	router.post(
		"/fill/draft",
		passport.authenticate("jwt", { session: false }),
		(req, res) => {
			testDrafts(req, res, req.user);
		}
	);

	return router;
};
