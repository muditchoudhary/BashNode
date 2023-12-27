import { UserModel } from "../models/User.model.js";
import { SERVER_RESPONSES } from "../globalConstants/constants.js";
import { coverImgsAzureFunctions } from "../azureFunctions/coverImages.azure.functions.js";
import { PublishedBlogModel } from "../models/Published.model.js";

const USER_CONTAINER_NAME = "users-avtar-images";

export const UserController = (
	userModel = UserModel,
	publishedBlogModel = PublishedBlogModel
) => {
	const { saveImgToContainer } = coverImgsAzureFunctions();
	const getUserAvatarLikes = async (req, res, user) => {
		try {
			const data = await userModel.findById(user).select("user_avatar liked_blogs");
			return res.status(SERVER_RESPONSES.OK).json({
				success: true,
				avatar: data.user_avatar,
                liked_blogs: data.liked_blogs,
			});
		} catch (error) {
			console.error(error);
			return res.status(SERVER_RESPONSES.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: "Internal Server errors",
			});
		}
	};

	const getUserDetails = async (req, res, user) => {
		try {
			const details = await userModel
				.findById(user)
				.select("username email user_avatar");
			return res.status(SERVER_RESPONSES.OK).json({
				success: true,
				details: details,
			});
		} catch (error) {
			console.error(error);
			return res.status(SERVER_RESPONSES.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: "Internal Server errors",
			});
		}
	};

	const getStoredUserAvatar = async (user) => {
		const storedAvatar = await userModel
			.findById(user)
			.select("user_avatar");
		return storedAvatar.user_avatar;
	};

	const updateAvatar = async (req, res, user) => {
		try {
			const storedAvatarNullInFrontend = req.body.isUserAvatarNull;
            console.log(storedAvatarNullInFrontend);
			const storedAvatarURL = await getStoredUserAvatar(user);

			let blobImgURL = storedAvatarURL;

			if (req.file !== undefined) {
				blobImgURL = await saveImgToContainer(
					req.file,
					USER_CONTAINER_NAME
				);
			} else if (
				storedAvatarURL !== "" &&
				storedAvatarNullInFrontend === "true"
			) {
				blobImgURL = "";
			}

			await userModel.findByIdAndUpdate(user, {
				user_avatar: blobImgURL,
			});

			await publishedBlogModel.updateMany(
				{ user_id: user },
				{ author_avatar: blobImgURL }
			);

			return res.status(SERVER_RESPONSES.OK).json({
				success: true,
				message: "Avatar updated successfully",
			});
		} catch (error) {
			console.error(error);
			return res.status(SERVER_RESPONSES.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: "Internal Server errors",
			});
		}
	};

	return {
		getUserAvatarLikes,
		getUserDetails,
		updateAvatar,
	};
};
