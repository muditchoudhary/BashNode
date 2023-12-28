import { validationResult, matchedData } from "express-validator";

import { PublishedBlogModel } from "../models/Published.model.js";
import { UserModel } from "../models/User.model.js";
import { coverImgsAzureFunctions } from "../azureFunctions/coverImages.azure.functions.js";
import { SERVER_RESPONSES } from "../globalConstants/constants.js";

const PUBLISHED_CONTAINER_NAME = "published-cover-images";

export const PublishController = (
	publishedBlogModel = PublishedBlogModel,
	userModel = UserModel
) => {
	const getPublishedBlogs = async (req, res, user) => {
		try {
			const blogId = req.params.blogId;
			const publishedBlog = await publishedBlogModel.findOne({
				_id: blogId,
			});
			if (!publishedBlog) {
				return res.status(SERVER_RESPONSES.BAD_REQUEST).json({
					success: false,
					message: "Blog not found.",
				});
			}
			return res.status(SERVER_RESPONSES.OK).json({
				success: true,
				blog: publishedBlog,
			});
		} catch (error) {
			console.error(error);
			return res.status(SERVER_RESPONSES.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: "Internal server error.",
			});
		}
	};
	const getStoredCoverImgURL = async (user, blogId) => {
		const { cover_img: storedCoverImgURL } = await publishedBlogModel
			.findOne({
				_id: blogId,
			})
			.select({ cover_img: 1 });

		return storedCoverImgURL;
	};
	const updatePublished = async (req, res, user) => {
		const { saveImgToContainer } = coverImgsAzureFunctions();
		try {
			const validationErrors = validationResult(req);
			if (!validationErrors.isEmpty()) {
				return res.status(SERVER_RESPONSES.VALIDATION_CONFLICT).json({
					success: false,
					validationErrors: validationErrors.mapped(),
				});
			}

			const blogId = req.body.blogId;
			const data = matchedData(req);
			const isCoverImgNullInFrontend = req.body.isCoverImgNull;

			const storedCoverImgURL = await getStoredCoverImgURL(user, blogId);

			let blobImageUrl = storedCoverImgURL;

			// If user uploaded a new cover image
			if (req.file !== undefined) {
				blobImageUrl = await saveImgToContainer(
					req.file,
					PUBLISHED_CONTAINER_NAME
				);
				// User has not uploaded a cover image
			} else if (
				storedCoverImgURL !== "" &&
				isCoverImgNullInFrontend === "true"
			) {
				blobImageUrl = "";
			}

			await publishedBlogModel.updateOne(
				{ _id: blogId },
				{
					title: data.title,
					content: data.content,
					updated_at: Date.now(),
					cover_img: blobImageUrl,
				}
			);

			return res
				.status(SERVER_RESPONSES.OK)
				.json({ success: true, message: "Blog updated" });
		} catch (error) {
			console.error(error);
			return res
				.status(SERVER_RESPONSES.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: "Internal Server Error" });
		}
	};

	const getPublishedBlogPosts = async (req, res) => {
		const { page = 1, limit = 10 } = req.query;
		try {
			const publishedBlogs = await publishedBlogModel
				.find()
				.sort({ published_at: -1 })
				.limit(limit * 1)
				.skip((page - 1) * limit)
				.exec();

			const count = await publishedBlogModel.countDocuments();

			return res.status(SERVER_RESPONSES.OK).json({
				success: true,
				publishedBlogs,
				totalPages: Math.ceil(count / limit),
				currentPage: page,
			});
		} catch (error) {
			console.error(error);
			return res.status(SERVER_RESPONSES.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: "Internal server error.",
			});
		}
	};

	const geTotalPublishedBlogs = async (req, res) => {
		try {
			const totalPosts = await publishedBlogModel.find({}).count();
			return res
				.status(SERVER_RESPONSES.OK)
				.json({ success: true, totalPosts });
		} catch (error) {
			console.error(error);
			return res.status(SERVER_RESPONSES.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: "Internal server error.",
			});
		}
	};

	const getSinglePublishedBlog = async (req, res) => {
		try {
			const blogId = req.params.blogId;
			let blog = await publishedBlogModel.findOne({
				_id: blogId,
			});
			if (!blog) {
				return res
					.status(SERVER_RESPONSES.BAD_REQUEST)
					.json({ success: false, message: "Blog Not Found" });
			}
			return res
				.status(SERVER_RESPONSES.OK)
				.json({ success: true, blog });
		} catch (error) {
			console.error(error);
			return res.status(SERVER_RESPONSES.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: "Internal server error.",
			});
		}
	};

	const deletePublishedBlog = async (req, res, user) => {
		try {
			const blogId = req.params.blogId;
			const result = await publishedBlogModel.findOneAndDelete({
				_id: blogId,
			});
			if (!result) {
				return res
					.status(SERVER_RESPONSES.BAD_REQUEST)
					.json({ success: false, message: "Blog Not Found" });
			}
			return res
				.status(SERVER_RESPONSES.OK)
				.json({ success: true, message: "Blog Deleted" });
		} catch (error) {
			console.error(error);
			return res
				.status(SERVER_RESPONSES.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: "Internal Server Error" });
		}
	};

	const likedBlog = async (req, res, user) => {
		try {
			const blogId = req.params.blogId;
			const updatedBlog = await publishedBlogModel.findOneAndUpdate(
				{ _id: blogId },
				{
					$inc: { likes: 1 },
				},
				{ new: true }
			);
			await userModel.updateOne(
				{ _id: user },
				{ $addToSet: { liked_blogs: blogId } }
			);

			return res.status(SERVER_RESPONSES.OK).json({
				success: true,
				likes: updatedBlog.likes,
			});
		} catch (error) {
			console.error(error);
			return res
				.status(SERVER_RESPONSES.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: "Internal Server Error" });
		}
	};

	const dislikedBlog = async (req, res, user) => {
		try {
			const blogId = req.params.blogId;
			const updatedBlog = await publishedBlogModel.findOneAndUpdate(
				{ _id: blogId },
				{
					$inc: { likes: -1 },
				},
				{ new: true }
			);
			await userModel.updateOne(
				{ _id: user },
				{ $pull: { liked_blogs: blogId } }
			);

			return res
				.status(SERVER_RESPONSES.OK)
				.json({ success: true, likes: updatedBlog.likes });
		} catch (error) {
			console.error(error);
			return res
				.status(SERVER_RESPONSES.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: "Internal Server Error" });
		}
	};

	const getBlogLikes = async (req, res) => {
		try {
			const blogId = req.params.blogId;
			const result = await publishedBlogModel.findOne({
				_id: blogId,
			});
			if (!result) {
				return res
					.status(SERVER_RESPONSES.BAD_REQUEST)
					.json({ success: false, message: "Blog Not Found" });
			}
			return res
				.status(SERVER_RESPONSES.OK)
				.json({ success: true, likes: result.likes });
		} catch (error) {
			console.error(error);
			return res
				.status(SERVER_RESPONSES.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: "Internal Server Error" });
		}
	};

	return {
		getPublishedBlogs,
		updatePublished,
		getPublishedBlogPosts,
		geTotalPublishedBlogs,
		getSinglePublishedBlog,
		deletePublishedBlog,
		likedBlog,
		dislikedBlog,
		getBlogLikes,
	};
};
