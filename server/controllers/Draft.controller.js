import { UserModel } from "../models/User.model.js";
import { DraftModel } from "../models/Draft.model.js";
import { PublishedBlogModel } from "../models/Published.model.js";

export const DraftController = (
	userModel = UserModel,
	draftModel = DraftModel,
	publishedBlogModel = PublishedBlogModel
) => {
	const createNewDraft = async (req, res, next) => {
		try {
			const draft = new userModel();
			const result = await draft.save();
			console.log("draft", draft);
			console.log("result", result);
			// return res.status(200).json()
		} catch (error) {
			console.error(error);
		}
	};

	const getTitlesAndKeys = async (req, res, next) => {
		const { email } = JSON.parse(req.headers.user);
		try {
			const user = await userModel.findOne({ email });
			const userId = user._id;

			let drafts = await draftModel
				.find({ user_id: userId })
				.select({ title: 1 });

			if (drafts.length === 0) {
				let draft = new draftModel({
					user_id: userId,
				});
				await draft.save();

				drafts = await draftModel.find({ user_id: userId });
			}

			const publishedBlogs = await publishedBlogModel
				.find({
					user_id: userId,
				})
				.select({ title: 1 });

			return res.status(200).json({ drafts, publishedBlogs });
		} catch (error) {
			console.error(error);
		}
	};
	return { getTitlesAndKeys };
};
