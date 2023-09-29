import { validationResult, matchedData } from "express-validator";

import { DraftModel } from "../models/Draft.model.js";
import { PublishedBlogModel } from "../models/Published.model.js";

export const DraftController = (
	draftModel = DraftModel,
	publishedBlogModel = PublishedBlogModel
) => {
	const saveDraft = async (req, res, user) => {
		try {
			const validationErrors = validationResult(req);
			if (!validationErrors.isEmpty()) {
				return res
					.status(409)
					.json({ validationErrors: validationErrors.mapped() });
			}

			const draftId = req.body.draftId;
			const data = matchedData(req);

			const result = await draftModel.updateOne(
				{ user_id: user._id, _id: draftId },
				{
					title: data.title,
					content: data.content,
					updated_at: Date.now(),
				}
			);

			return res
				.status(200)
				.json({ success: true, message: "Draft saved" });
		} catch (error) {
			console.error("Error from saveDraft\n\n", error);
			return res
				.status(500)
				.json({ success: false, message: "Internal Server Error" });
		}
	};

	const getTitlesAndKeys = async (req, res, user) => {
		try {
			let drafts = await draftModel
				.find({ user_id: user._id })
				.select({ _id: 1, title: 1 });

			if (drafts.length === 0) {
				let draft = new draftModel({
					user_id: user._id,
				});
				const result = await draft.save();

				drafts = await draftModel
					.find({ user_id: user._id })
					.select({ _id: 1, title: 1 });
			}

			const publishedBlogs = await publishedBlogModel.find({
				user_id: user._id,
			});

			return res.status(200).json({ drafts, publishedBlogs });
		} catch (error) {
			console.error("Error in getTitlesAndKeys:\n\n", error);
		}
	};

	const getDraft = async (req, res, user) => {
		try {
			const draftId = req.params.draftId;
			const draft = await draftModel.findOne({
				user_id: user._id,
				_id: draftId,
			});
			return res.status(200).json(draft);
		} catch (error) {
			console.error("Error in getDraft:\n\n", error);
		}
	};

	const getPublishedBlogs = async (req, res, user) => {
		try {
			const blogId = req.params.blogId;
			const publishedBlog = await publishedBlogModel.findOne({
				user_id: user._id,
				_id: blogId,
			});
			return res.status(200).json(publishedBlog);
		} catch (error) {
			console.error("Error in getDraft:\n\n", error);
		}
	};

	const updatePublished = async (req, res, user) => {
		try {
			const validationErrors = validationResult(req);
			if (!validationErrors.isEmpty()) {
				return res
					.status(409)
					.json({ validationErrors: validationErrors.mapped() });
			}

			const blogId = req.body.blogId;
			const data = matchedData(req);

			const result = await publishedBlogModel.updateOne(
				{ user_id: user._id, _id: blogId },
				{
					title: data.title,
					content: data.content,
					updated_at: Date.now(),
				}
			);

			return res
				.status(200)
				.json({ success: true, message: "Blog updated" });
		} catch (error) {
			console.error(error);
		}
	};

	const publishDraft = async (req, res, user) => {
		try {
			const validationErrors = validationResult(req);
			if (!validationErrors.isEmpty()) {
				return res
					.status(409)
					.json({ validationErrors: validationErrors.mapped() });
			}

			const draftId = req.body.draftId;
			const data = matchedData(req);

			// first deleting from the draft collection
			await draftModel.deleteOne({ user_id: user._id, _id: draftId });
			// second saving to the published collection
			const publishBlog = new publishedBlogModel({
				title: data.title,
				content: data.content,
				user_id: user._id,
				created_at: Date.now(),
				updated_at: Date.now(),
			});
			await publishBlog.save();

			return res
				.status(200)
				.json({ success: true, message: "Draft Published" });
		} catch (error) {
			console.error(error);
		}
	};

	return {
		getTitlesAndKeys,
		saveDraft,
		getDraft,
		getPublishedBlogs,
		updatePublished,
		publishDraft,
	};
};
