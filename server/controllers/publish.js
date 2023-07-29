import { UserModel } from "../db/usersDB.js";
import { DraftModel } from "../db/draftsDB.js";

const DraftController = () => {
	const handleDraft = async (req, res, next) => {
		const { email } = JSON.parse(req.headers.user);

		try {
			const user = await UserModel.findOne({ email });
			const user_id = user ? user._id : null;

			const existingBlogDraft = await DraftModel.findOne({ user_id });

			if (existingBlogDraft) {
				return res.status(200).json(existingBlogDraft);
			}

			const newBlogDraft = new DraftModel({
				title: "",
				content: "",
				user_id: user_id,
				created_at: Date.now(),
				updated_at: Date.now(),
			});

            await newBlogDraft.save();

			return res.status(200).json(newBlogDraft);
		} catch (error) {
			console.error("Error in handleDraft:", error);
			res.status(500).json({
				error: "Internal Server Error",
			});
		}
	};

	return { handleDraft };
};

export default DraftController;
