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

			const data = matchedData(req);

			const result = await draftModel.updateOne(
				{ user_id: user._id },
				{
					title: data.title,
					content: data.content,
					created_at: Date.now(),
					updated_at: Date.now(),
				}
			);

			return res
				.status(200)
				.json({ success: true, message: "Draft saved" });
		} catch (error) {
			console.error(error);
		}
	};

	const getTitlesAndKeys = async (req, res, user) => {
		try {
			let drafts = await draftModel.find({ user_id: user._id });

			if (drafts.length === 0) {
				let draft = new draftModel({
					user_id: user._id,
				});
				const result = await draft.save();

				drafts = result;
			}

			const publishedBlogs = await publishedBlogModel
				.find({
					user_id: user._id,
				})
				.select({ title: 1 });

			return res.status(200).json({ drafts, publishedBlogs });
		} catch (error) {
			console.error("Error in getTitlesAndKeys:\n\n", err);
		}
	};
	return { getTitlesAndKeys, saveDraft };
};
