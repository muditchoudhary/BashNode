import BlogDraft from "../models/blogDraft";
import User from "../models/user";

const DraftController = () => {
	const handleDraft = async (req, res, next) => {
		const { email } = req.body.user;

		try {
			const user = await User.findOne({ email });
			const user_id = user ? user._id : null;

			const existingBlogDraft = await BlogDraft.findOne({ user_id });

			if (existingBlogDraft) {
				return res.status(200).json(existingBlogDraft);
			}

			const newBlogDraft = new BlogDraft({
				title: "",
				content: "",
				user_id: user_id,
				created_at: Date.now(),
				updated_at: Date.now(),
			});

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
