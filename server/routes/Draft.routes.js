import express from "express";

import { DraftController } from "../controllers/Draft.controller.js";

export const loadDraftRoutes = (controller = DraftController) => {
	const router = express.Router();
	const { getTitlesAndKeys } = controller();

	router.get("/draft", getTitlesAndKeys);

	return router;
};

// router.post("/publish-blog", async (req, res) => {
// 	const { email } = JSON.parse(req.headers.user);
// 	const { title, content } = req.body.draft;
// 	const user = await UserModel.findOne({ email });
// 	const userId = user ? user._id : null;

// 	const newBlog = new PublishedBlogModel({
// 		title: title,
// 		content: content,
// 		user_id: userId,
// 		created_at: Date.now(),
// 		updated_at: Date.now(),
// 	});

// 	await newBlog.save();

// 	res.status(200).json({ message: "success" });
// });
