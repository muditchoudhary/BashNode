import express from "express";
import passport from "passport";
import multer from "multer";

import { blogValidation } from "../validators/Blog.validation.js";
import { fileValidation } from "../validators/File.validation.js";
import { MAX_COVER_IMG_SIZE } from "../globalConstants/constants.js";
import { PublishController } from "../controllers/Publish.controller.js";
import { handleFileUpload } from "./fileOperations.js";

const GET_PUBLISH_BLOG_ROUTE = "/publish/:blogId";
const UPDATE_PUBLISH_BLOG_ROUTE = "/publish/update";
const GET_PUBLISHED_BLOGS_ROUTE = "/published/blogs";
const GET_TOTAL_PUBLISHED_BLOGS_ROUTE = "/totalPublishedBlogs";
const GET_SINGLE_BLOG_ROUTE = "/getsingleBlog/:blogId";
const DELETE_PUBLISH_ROUTE = "/publish/delete/:blogId";
const BLOG_LIKED_ROUTE = "/publish/like/:blogId";
const BLOG_UNLIKED_ROUTE = "/publish/unlike/:blogId";
const GET_BLOG_LIKES_ROUTE = "/publish/getlikes/:blogId";

export const loadPublishRoutes = (
	controller = PublishController,
	validator = blogValidation,
	fileValidator = fileValidation
) => {
	const router = express.Router();
	const { validateCoverImg } = fileValidator();
	const { validateBlogData } = validator();
	const {
		getPublishedBlogs,
		updatePublished,
		getPublishedBlogPosts,
		geTotalPublishedBlogs,
		getSinglePublishedBlog,
		deletePublishedBlog,
		likedBlog,
		dislikedBlog,
        getBlogLikes,
	} = controller();

	const upload = multer({
		fileFilter: validateCoverImg,
		limits: {
			fileSize: MAX_COVER_IMG_SIZE,
		},
	});

	router.get(
		GET_PUBLISH_BLOG_ROUTE,
		passport.authenticate("jwt", { session: false }),
		(req, res) => {
			getPublishedBlogs(req, res, req.user);
		}
	);

	router.put(
		UPDATE_PUBLISH_BLOG_ROUTE,
		passport.authenticate("jwt", { session: false }),
		(req, res, next) => {
			handleFileUpload(req, res, next, upload, "coverImg");
		},
		validateBlogData(),
		(req, res) => {
			updatePublished(req, res, req.user);
		}
	);

	router.get(GET_PUBLISHED_BLOGS_ROUTE, (req, res) => {
		getPublishedBlogPosts(req, res, req.user);
	});

	router.get(GET_TOTAL_PUBLISHED_BLOGS_ROUTE, (req, res) => {
		geTotalPublishedBlogs(req, res, req.user);
	});

	router.get(GET_SINGLE_BLOG_ROUTE, (req, res) => {
		getSinglePublishedBlog(req, res, req.user);
	});

	router.delete(
		DELETE_PUBLISH_ROUTE,
		passport.authenticate("jwt", { session: false }),
		(req, res) => {
			deletePublishedBlog(req, res, req.user);
		}
	);

	router.get(
		GET_BLOG_LIKES_ROUTE,
		(req, res) => {
			getBlogLikes(req, res, req.user);
		}
	);

	router.put(
		BLOG_LIKED_ROUTE,
		passport.authenticate("jwt", { session: false }),
		(req, res) => {
			likedBlog(req, res, req.user);
		}
	);

	router.put(
		BLOG_UNLIKED_ROUTE,
		passport.authenticate("jwt", { session: false }),
		(req, res) => {
			dislikedBlog(req, res, req.user);
		}
	);

	return router;
};
