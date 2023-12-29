import { validationResult, matchedData } from "express-validator";
import fetch from "node-fetch";
import sizeOf from "image-size";

import { DraftModel } from "../models/Draft.model.js";
import { UserModel } from "../models/User.model.js";
import { PublishedBlogModel } from "../models/Published.model.js";
import { coverImgsAzureFunctions } from "../azureFunctions/coverImages.azure.functions.js";
import { getFileNameFromUrl } from "./helpers/getFileNameFromUrl.js";
import { SERVER_RESPONSES } from "../globalConstants/constants.js";

const DRAFTS_CONTAINER_NAME = "drafts-cover-images";
const PUBLISHED_CONTAINER_NAME = "published-cover-images";

export const DraftController = (
	userModel = UserModel,
	draftModel = DraftModel,
	publishedBlogModel = PublishedBlogModel
) => {
	const { saveImgToContainer } = coverImgsAzureFunctions();

	const saveDraft = async (req, res, user) => {
		try {
			const validationErrors = validationResult(req);

			if (!validationErrors.isEmpty()) {
				return res.status(SERVER_RESPONSES.VALIDATION_CONFLICT).json({
					success: false,
					validationErrors: validationErrors.mapped(),
				});
			}

			const draftId = req.body.draftId;
			const data = matchedData(req);
			const isCoverImgNullInFrontend = req.body.isCoverImgNull;

			const storedCoverImgURL = await getStoredCoverImgURL(user, draftId);

			let blobImageURL = storedCoverImgURL;

			// If user uploaded a new cover image
			if (req.file !== undefined) {
				blobImageURL = await saveImgToContainer(
					req.file,
					DRAFTS_CONTAINER_NAME
				);
			} else if (
				storedCoverImgURL !== "" &&
				isCoverImgNullInFrontend === "true"
			) {
				// User did not upload a new cover image nor in frontend any cover image applied , but there is an existing cover image in db
				blobImageURL = "";
			}

			await updateDraftModel(user, draftId, {
				title: data.title,
				content: data.content,
				updated_at: Date.now(),
				cover_img: blobImageURL,
			});

			return res
				.status(SERVER_RESPONSES.OK)
				.json({ success: true, message: "Draft saved" });
		} catch (error) {
			console.error(error);
			return res
				.status(SERVER_RESPONSES.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: "Internal Server Error" });
		}
	};

	const getStoredCoverImgURL = async (user, draftId) => {
		const { cover_img: storedCoverImgURL } = await draftModel
			.findOne({ _id: draftId })
			.select({ cover_img: 1 });

		return storedCoverImgURL;
	};

	const updateDraftModel = async (user, draftId, updateData) => {
		await draftModel.updateOne({ _id: draftId }, updateData);
	};

	const getTitlesAndKeys = async (req, res, user) => {
		try {
			let drafts = await draftModel
				.find({ user_id: user })
				.select({ _id: 1, title: 1 });
			// If no drafts are found, create a new draft
			if (drafts.length === 0) {
				let draft = new draftModel({
					user_id: user,
				});
				const result = await draft.save();

				drafts = await draftModel
					.find({ user_id: user })
					.select({ _id: 1, title: 1 });
			}

			const publishedBlogs = await publishedBlogModel
				.find({
					user_id: user,
				})
				.select({ _id: 1, title: 1 });

			return res.status(SERVER_RESPONSES.OK).json({
				success: true,
				titleAndKeys: { drafts, publishedBlogs },
			});
		} catch (error) {
			console.error(error);
			return res
				.status(SERVER_RESPONSES.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: "Internal Server Error" });
		}
	};

	const getDraft = async (req, res, user) => {
		try {
			const draftId = req.params.draftId;
			const draft = await draftModel.findOne({
				_id: draftId,
			});
			if (!draft) {
				return res.status(SERVER_RESPONSES.BAD_REQUEST).json({
					success: false,
					message: "Draft Not Found",
				});
			}
			return res.status(SERVER_RESPONSES.OK).json({
				success: true,
				blog: draft,
			});
		} catch (error) {
			console.error(error);
			return res.status(SERVER_RESPONSES.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: "Internal Server Error",
			});
		}
	};

	// Function to download the image from the URL using fetch
	async function downloadImage(url) {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(
				`Failed to download image. Status: ${response.status}`
			);
		}

		const buffer = await response.arrayBuffer();

		// Convert to Node.js Buffer explicitly
		return Buffer.from(buffer);
	}

	// Function to determine the image mimetype
	const getImageMimetype = (imageBuffer) => {
		const dimensions = sizeOf(imageBuffer);
		switch (dimensions.type) {
			case "jpg":
				return "image/jpg";
			case "png":
				return "image/png";
			case "jpeg":
				return "image/jpeg";
			default:
				throw new Error("Unsupported image type");
		}
	};
	const getUserNameAndAvtarByUserId = async (userId) => {
		const { username, user_avatar } = await userModel
			.findOne({
				_id: userId,
			})
			.select({ username: 1, user_avatar: 1 });

		return { username, user_avatar };
	};

	const publishDraft = async (req, res, user) => {
		try {
			const validationErrors = validationResult(req);

			if (!validationErrors.isEmpty()) {
				return res.status(SERVER_RESPONSES.VALIDATION_CONFLICT).json({
					success: false,
					validationErrors: validationErrors.mapped(),
				});
			}
			const isCoverImgNullInFrontend = req.body.isCoverImgNull;
			const draftId = req.body.draftId;
			const data = matchedData(req);
			const storedCoverImgURL = await getStoredCoverImgURL(user, draftId);
			const storedCoverImg = getFileNameFromUrl(storedCoverImgURL);
			const { username, user_avatar } = await getUserNameAndAvtarByUserId(
				user
			);

			// Delete the draft
			const result = await draftModel.findOneAndDelete({
				_id: draftId,
			});

			if (!result) {
				return res.status(SERVER_RESPONSES.BAD_REQUEST).json({
					success: false,
					message: "Draft Not Found",
				});
			}
			let blobImageURL = storedCoverImgURL;

			// If user uploaded a new cover image
			if (req.file !== undefined) {
				blobImageURL = await saveImgToContainer(
					req.file,
					PUBLISHED_CONTAINER_NAME
				);
				// the user has has not upload a cover image but already a cover image is applied from db.
			} else if (
				storedCoverImgURL !== "" &&
				isCoverImgNullInFrontend === "false"
			) {
				const blobName = storedCoverImg;
				const imageData = await downloadImage(storedCoverImgURL);
				const imageMimeType = getImageMimetype(imageData);

				blobImageURL = await saveImgToContainer(
					{
						buffer: imageData,
						size: imageData.length,
						mimetype: imageMimeType,
						originalname: blobName,
					},
					PUBLISHED_CONTAINER_NAME
				);
			} else if (
				storedCoverImgURL !== "" &&
				isCoverImgNullInFrontend === "true"
			) {
				blobImageURL = "";
			}

			const publishBlog = new publishedBlogModel({
				title: data.title,
				content: data.content,
				user_id: user,
				published_at: Date.now(),
				updated_at: Date.now(),
				author_name: username,
				author_avatar: user_avatar,
				likes: 0,
				cover_img: blobImageURL,
			});

			await publishBlog.save();

			return res.status(SERVER_RESPONSES.OK).json({
				success: true,
				message: "Draft Published",
				blogId: publishBlog._id,
			});
		} catch (error) {
			console.error(error);
			return res
				.status(SERVER_RESPONSES.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: "Internal Server Error" });
		}
	};

	const deleteDraft = async (req, res, user) => {
		try {
			const draftId = req.params.blogId;
			const result = await draftModel.findOneAndDelete({
				_id: draftId,
			});
			if (!result) {
				return res
					.status(SERVER_RESPONSES.BAD_REQUEST)
					.json({ success: false, message: "Draft Not Found" });
			}
			return res
				.status(SERVER_RESPONSES.OK)
				.json({ success: true, message: "Draft Deleted" });
		} catch (error) {
			console.error(error);
			return res
				.status(SERVER_RESPONSES.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: "Internal Server Error" });
		}
	};

	const createNewDraft = async (req, res, user) => {
		try {
			const draft = new draftModel({
				user_id: user,
			});
			const result = await draft.save();
			return res.status(SERVER_RESPONSES.OK).json({
				success: true,
				message: "New Draft Created",
				draft: {
                    _id: result._id,
					title: result.title,
				},
			});
		} catch (error) {
			console.error(error);
			return res
				.status(SERVER_RESPONSES.INTERNAL_SERVER_ERROR)
				.json({ success: false, message: "Internal Server Error" });
		}
	};

	return {
		getTitlesAndKeys,
		saveDraft,
		getDraft,
		publishDraft,
		deleteDraft,
		createNewDraft,
	};
};
