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
		// const demoContent =
		// 	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ut libero urna. Morbi in purus bibendum, posuere libero nec, vehicula libero. Curabitur hendrerit risus eget lectus tempus, id facilisis orci sollicitudin. Curabitur condimentum metus vitae urna ultrices dictum. Integer et nisl at ex suscipit varius. Aliquam erat volutpat. Vestibulum in mauris sed ligula volutpat accumsan.\nVestibulum ut sapien vitae nisi volutpat consectetur. Vivamus nec lacus sapien. Etiam vitae vestibulum elit. Proin ut lacus vel augue congue elementum. Sed ut nulla a odio ultrices vulputate. Duis volutpat, sapien in sollicitudin bibendum, libero elit posuere neque, vel pellentesque tellus augue a libero. Phasellus rhoncus ante et nulla cursus, ut viverra nisl tristique. Sed non purus et tortor cursus efficitur.\nSed vel risus a velit vulputate commodo. Aliquam erat volutpat. Vestibulum non quam eu eros scelerisque ullamcorper a non arcu. Vestibulum lobortis auctor quam, in finibus elit laoreet nec. In hac habitasse platea dictumst. Nulla ut libero ut felis cursus tempus. Integer at dui in quam convallis cursus. Sed in metus a quam laoreet vestibulum. Pellentesque hendrerit, ex non malesuada venenatis, massa lacus pulvinar libero, vel facilisis nisi purus vitae quam. Nam congue augue sed sapien congue lacinia. Sed sagittis auctor lectus id varius.\nPhasellus scelerisque sem nec orci condimentum aliquet. Integer bibendum id sapien ut malesuada. Ut dapibus purus ut lacinia iaculis. Ut id dui vitae nisl accumsan pellentesque. Aenean euismod, ipsum id venenatis semper, odio justo iaculis mi, vitae tincidunt urna tellus a dui. Vestibulum a justo ac odio convallis efficitur eu in neque. Aliquam volutpat ex vitae posuere facilisis. Duis aliquet sagittis vulputate. Sed tincidunt diam et neque pharetra, vel consequat nulla convallis. Integer ac metus vel sem scelerisque tincidunt vel vitae eros. Vestibulum iaculis, elit eu lacinia efficitur, ligula ex suscipit nibh, eu dignissim quam urna nec tellus. Nam varius tempor mauris, a finibus risus vestibulum non.\nPellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed ac arcu ut mauris tincidunt congue. Nam ullamcorper ultrices arcu, at eleifend velit luctus non. Sed semper, purus vel venenatis tincidunt, metus arcu vulputate lectus, a fringilla quam urna non ante. Integer nec accumsan ex, at elementum justo. Quisque eu elit in libero sagittis tincidunt. Donec vulputate bibendum ligula, non dapibus metus dignissim ut. Vestibulum vehicula bibendum odio, id cursus ex tincidunt non. Ut finibus metus id libero pulvinar, vel ultrices dui egestas. Ut semper, mi a convallis posuere, tortor sapien tristique arcu, eu commodo sem dui sit amet ipsum. Fusce convallis, quam et tempor venenatis, nibh ex feugiat ex, a tincidunt mi felis nec arcu.\nMaecenas eu nulla non arcu rhoncus cursus. Curabitur ut quam in massa bibendum efficitur. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut ut metus a quam sagittis iaculis nec in sem. Nunc eu nibh vel urna vestibulum convallis. Nam vel lacus vitae purus pharetra malesuada. Aenean tincidunt metus vel odio facilisis laoreet. Duis vel odio sed est venenatis scelerisque. Nam posuere tortor a dui sagittis, eu scelerisque sapien lobortis. Duis vulputate mi non tincidunt tristique. Sed sed nisl vitae velit pharetra sollicitudin et eu lectus. Nullam venenatis tincidunt venenatis. Nulla eu velit sem. Sed eu sagittis sem. Integer at sapien orci. Suspendisse eu semper odio, et efficitur turpis. Vivamus sollicitudin augue a venenatis fermentum.";
		// try {
		// 	const { username, user_avatar } = await getUserNameAndAvtarByUserId(
		// 		user
		// 	);
		// 	let testBlog = [];
		// 	for (let i = 0; i < 30; i++) {
		// 		const blog = {
		// 			title: `Hello world this is the Test Blog ${
		// 				i + 1
		// 			}. And I hope it long`,
		// 			content: demoContent,
		// 			// user_id: mongoose.Types.ObjectId(user),
		// 		};
		// 		testBlog.push(blog);
		// 	}
		// 	for (const blog of testBlog) {
		// 		const publishBlog = new publishedBlogModel({
		// 			title: blog.title,
		// 			content: blog.content,
		// 			user_id: user,
		// 			author_name: username,
		// 			author_avatar: user_avatar,
		// 			published_at: Date.now(),
		// 			updated_at: Date.now(),
		// 		});
		// 		await publishBlog.save();
		// 	}
		// 	return res
		// 		.status(200)
		// 		.json({ success: true, message: "Blogs Added" });
		// } catch (error) {
		// 	console.error(error);
		// }
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

	const testDrafts = async (req, res, user) => {
		const demoContent =
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ut libero urna. Morbi in purus bibendum, posuere libero nec, vehicula libero. Curabitur hendrerit risus eget lectus tempus, id facilisis orci sollicitudin. Curabitur condimentum metus vitae urna ultrices dictum. Integer et nisl at ex suscipit varius. Aliquam erat volutpat. Vestibulum in mauris sed ligula volutpat accumsan.\nVestibulum ut sapien vitae nisi volutpat consectetur. Vivamus nec lacus sapien. Etiam vitae vestibulum elit. Proin ut lacus vel augue congue elementum. Sed ut nulla a odio ultrices vulputate. Duis volutpat, sapien in sollicitudin bibendum, libero elit posuere neque, vel pellentesque tellus augue a libero. Phasellus rhoncus ante et nulla cursus, ut viverra nisl tristique. Sed non purus et tortor cursus efficitur.\nSed vel risus a velit vulputate commodo. Aliquam erat volutpat. Vestibulum non quam eu eros scelerisque ullamcorper a non arcu. Vestibulum lobortis auctor quam, in finibus elit laoreet nec. In hac habitasse platea dictumst. Nulla ut libero ut felis cursus tempus. Integer at dui in quam convallis cursus. Sed in metus a quam laoreet vestibulum. Pellentesque hendrerit, ex non malesuada venenatis, massa lacus pulvinar libero, vel facilisis nisi purus vitae quam. Nam congue augue sed sapien congue lacinia. Sed sagittis auctor lectus id varius.\nPhasellus scelerisque sem nec orci condimentum aliquet. Integer bibendum id sapien ut malesuada. Ut dapibus purus ut lacinia iaculis. Ut id dui vitae nisl accumsan pellentesque. Aenean euismod, ipsum id venenatis semper, odio justo iaculis mi, vitae tincidunt urna tellus a dui. Vestibulum a justo ac odio convallis efficitur eu in neque. Aliquam volutpat ex vitae posuere facilisis. Duis aliquet sagittis vulputate. Sed tincidunt diam et neque pharetra, vel consequat nulla convallis. Integer ac metus vel sem scelerisque tincidunt vel vitae eros. Vestibulum iaculis, elit eu lacinia efficitur, ligula ex suscipit nibh, eu dignissim quam urna nec tellus. Nam varius tempor mauris, a finibus risus vestibulum non.\nPellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed ac arcu ut mauris tincidunt congue. Nam ullamcorper ultrices arcu, at eleifend velit luctus non. Sed semper, purus vel venenatis tincidunt, metus arcu vulputate lectus, a fringilla quam urna non ante. Integer nec accumsan ex, at elementum justo. Quisque eu elit in libero sagittis tincidunt. Donec vulputate bibendum ligula, non dapibus metus dignissim ut. Vestibulum vehicula bibendum odio, id cursus ex tincidunt non. Ut finibus metus id libero pulvinar, vel ultrices dui egestas. Ut semper, mi a convallis posuere, tortor sapien tristique arcu, eu commodo sem dui sit amet ipsum. Fusce convallis, quam et tempor venenatis, nibh ex feugiat ex, a tincidunt mi felis nec arcu.\nMaecenas eu nulla non arcu rhoncus cursus. Curabitur ut quam in massa bibendum efficitur. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut ut metus a quam sagittis iaculis nec in sem. Nunc eu nibh vel urna vestibulum convallis. Nam vel lacus vitae purus pharetra malesuada. Aenean tincidunt metus vel odio facilisis laoreet. Duis vel odio sed est venenatis scelerisque. Nam posuere tortor a dui sagittis, eu scelerisque sapien lobortis. Duis vulputate mi non tincidunt tristique. Sed sed nisl vitae velit pharetra sollicitudin et eu lectus. Nullam venenatis tincidunt venenatis. Nulla eu velit sem. Sed eu sagittis sem. Integer at sapien orci. Suspendisse eu semper odio, et efficitur turpis. Vivamus sollicitudin augue a venenatis fermentum.";
		try {
			let testBlog = [];
			for (let i = 0; i < 50; i++) {
				const blog = {
					title: `Hello world this is the Test draft ${
						i + 1
					}. And I hope it is long`,
					content: demoContent,
					// user_id: mongoose.Types.ObjectId("64fc33f08744bec13ce50057"),
				};
				testBlog.push(blog);
			}
			for (const blog of testBlog) {
				const draft = new draftModel({
					title: blog.title,
					content: blog.content,
					user_id: user,
					created_at: Date.now(),
					updated_at: Date.now(),
				});
				await draft.save();
			}
			return res
				.status(200)
				.json({ success: true, message: "Blogs Added" });
		} catch (error) {
			console.error(error);
		}
	};

	return {
		getTitlesAndKeys,
		saveDraft,
		getDraft,
		publishDraft,
		deleteDraft,
		testDrafts,
		createNewDraft,
	};
};
