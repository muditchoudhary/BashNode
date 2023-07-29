import { UserModel } from "../db/usersDB.js";
import { DraftModel } from "../db/draftsDB.js";

const DraftController = () => {
	const handleDraft = async (req, res, next) => {
		const { email } = JSON.parse(req.headers.user);

		try {
			const user = await UserModel.findOne({ email });
			const userId = user ? user._id : null;

			const existingBlogDraft = await DraftModel.findOne({ user_id: userId });

			if (existingBlogDraft) {
				return res.status(200).json(existingBlogDraft);
			}

			const newBlogDraft = new DraftModel({
				title: "",
				content: "",
				user_id: userId,
				created_at: Date.now(),
				updated_at: Date.now(),
			});

            await newBlogDraft.save();

			return res.status(200).json(newBlogDraft);
		} catch (error) {
			console.error("Error in handleDraft:\n\n", error);
			res.status(500).json({
				error: "Internal Server Error",
			});
		}
	};

	return { handleDraft };
};

export default DraftController;
