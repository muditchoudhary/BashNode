import { useForm, FormProvider } from "react-hook-form";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { SideDrawer } from "../components/SideDrawer";
import { EditorToolbar } from "../components/EditorToolbar";
import { useBlogActions } from "../hooks/useBlogActions";
import { Spinner } from "../../../common/Spinner";
import { handleResponse } from "../helpers/errorHandler";
import {
	updateMenuItemTitleInSideDrawer,
	removeDraftFromSideDrawer,
	removePublishedFromSideDrawer,
} from "../helpers/sideDrawerHelper";
import { SERVER_RESPONSES } from "../../../globalConstants/constants";
import { useLogout } from "../../authenticaton/hooks/useLogOut";

// For reference
// const DEMO_BLOG_DATA = {
// 	drafts: [
// 		{ title: "draft1", _id: "1" },
// 		{ title: "draft2", _id: "2" },
// 		{ title: "draft3", _id: "3" },
// 		{ title: "draft4", _id: "4" },
// 	],
// 	publishedBlogs: [
// 		{ title: "published1", _id: "5" },
// 		{ title: "published1", _id: "6" },
// 	],
// };

// currentDraft = {
//     "_id": "650e7cb8ff87844f90651aac",
//     "title": "working fine",
//     "content": "",
//     "user_id": "64fc33f08744bec13ce50057",
//     "created_at": "2023-09-23T05:50:48.684Z",
//     "updated_at": "2023-09-23T05:50:48.684Z",
//     "__v": 0
// }
const DRAFT_DELETE_API_URL = "http://localhost:3000/blog/draft/delete";
const PUBLISH_DELETE_API_URL = "http://localhost:3000/blog/publish/delete";

export const DraftLayout = () => {
	const [blogsTitleAndKeys, setBlogsTitleAndKeys] = useState([]);
	const [isBlogsTitleLoading, setIsBlogsTitleLoading] = useState(false);
	const [currentSelectedBlogKey, setCurrentSelectedBlogKey] = useState(null);
	const [isPreviewWindow, setIsPreviewWindow] = useState(false);
	const [isDraftWindow, setIsDraftWindow] = useState(true);
	const [currentDraft, setCurrentDraft] = useState(null);
	const [currentPublished, setCurrentPublished] = useState(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [coverImg, setCoverImg] = useState(null);
	const [isCoverImgNull, setIsCoverImgNull] = useState(true);
	const [wasDraftWindow, setWasDraftWindow] = useState(true);

	const methods = useForm({
		mode: "onSubmit",
	});

	const { logOut } = useLogout();

	const navigate = useNavigate();

	const {
		handleSaveDraft,
		handlePublishUpdate,
		handleDraftPublish,
		isBlogActionLoading,
		handleBlogDelete,
		fetchBlogsTitleAndKeys,
		fetchBlogWithId,
		createNewDraft,
	} = useBlogActions();

	const handleNewDraftButtonClick = async () => {
		const response = await createNewDraft();
		if (response["status"] === SERVER_RESPONSES.OK) {
			setBlogsTitleAndKeys({
				...blogsTitleAndKeys,
				drafts: [
					...blogsTitleAndKeys.drafts,
					{
						title: response["draft"]["title"],
						_id: response["draft"]["_id"],
					},
				],
			});
			setCurrentSelectedBlogKey(response["draft"]["_id"]);
			navigate(`/drafts/${response["draft"]["_id"]}`);
		} else if (response["status"] === SERVER_RESPONSES.UNAUTHORIZED) {
			toast.error("Token expired. Please login again");
			logOut();
		} else {
			handleResponse(response);
		}
	};

	const handleSaveButtonClick = methods.handleSubmit(
		async (data) => {
			// Checking for string because that means the user did not upload an image from fileStorage.
			// The image url is same as we got from the backend
			const coverImageObject =
				typeof coverImg === "string" ? null : coverImg;

			updateMenuItemTitleInSideDrawer(
				currentDraft._id,
				data.title,
				true,
				setBlogsTitleAndKeys
			);
			const response = await handleSaveDraft(
				currentDraft._id,
				data.title,
				data.article,
				coverImageObject,
				isCoverImgNull
			);
			if (response["status"] === SERVER_RESPONSES.UNAUTHORIZED) {
				toast.error("Token expired. Please login again");
				logOut();
			} else {
				handleResponse(response);
			}
		},
		(error) => {
			const validationErrorMsg = error[Object.keys(error)[0]]["message"];
			toast.error(validationErrorMsg);
		}
	);

	const handlePublishUpdateClick = methods.handleSubmit(
		async (data) => {
			updateMenuItemTitleInSideDrawer(
				currentPublished._id,
				data.title,
				false,
				setBlogsTitleAndKeys
			);
			// Checking for string because that means the user did not upload an image from fileStorage.
			// The image url is same as we got from the backend
			const response = await handlePublishUpdate(
				currentPublished._id,
				data.title,
				data.article,
				typeof coverImg === "string" ? null : coverImg,
				isCoverImgNull
			);
			if (response["status"] === SERVER_RESPONSES.UNAUTHORIZED) {
				toast.error("Token expired. Please login again");
				logOut();
			} else {
				handleResponse(response);
			}
		},
		(error) => {
			const validationErrorMsg = error[Object.keys(error)[0]]["message"];
			toast.error(validationErrorMsg);
		}
	);

	const handleSubmitForDraftPublish = methods.handleSubmit(
		async (data) => {
			const DELAY_TO_PUBLISHED_BLOG_IN_MS = 1200;

			// Checking for string because that means the user did not upload an image from fileStorage.
			// The image url is same as we got from the backend
			const response = await handleDraftPublish(
				currentDraft._id,
				data.title,
				data.article,
				typeof coverImg === "string" ? null : coverImg,
				isCoverImgNull
			);
			if (response["status"] === SERVER_RESPONSES.OK) {
				setTimeout(() => {
					navigate(`blog/${response["publishedBlogId"]}`, {
						replace: true,
					});
				}, DELAY_TO_PUBLISHED_BLOG_IN_MS);
			} else if (response["status"] === SERVER_RESPONSES.UNAUTHORIZED) {
				toast.error("Token expired. Please login again");
				logOut();
			} else {
				handleResponse(response);
			}
		},
		(error) => {
			const validationErrorMsg = error[Object.keys(error)[0]]["message"];
			toast.error(validationErrorMsg);
		}
	);

	const hasMoreDrafts = (blogsTitleAndKeys) => {
		return blogsTitleAndKeys.drafts.length > 0;
	};

	const hasMorePublishedBlogs = (blogsTitleAndKeys) => {
		return blogsTitleAndKeys.publishedBlogs.length > 0;
	};

	const navigateToDraft = async (newState) => {
		let draftIdToNavigate;

		if (hasMoreDrafts(newState)) {
			draftIdToNavigate = newState.drafts[0]["_id"];
		} else {
			const response = await fetchBlogsTitleAndKeys();
			const fetchedTitleAndKeys = response.titleAndKeys;
			setBlogsTitleAndKeys(fetchedTitleAndKeys);
			draftIdToNavigate = fetchedTitleAndKeys.drafts[0]["_id"];
		}

		// setCurrentSelectedBlogKey(draftIdToNavigate);
		navigate(`/drafts/${draftIdToNavigate}`);
	};

	const handleBlogDeletion = async (blogId, isDraft) => {
		if (!window.confirm("Are you sure you want to delete this blog?")) {
			return;
		}

		const apiURL = isDraft ? DRAFT_DELETE_API_URL : PUBLISH_DELETE_API_URL;
		const response = await handleBlogDelete(blogId, apiURL);

		if (response["status"] === SERVER_RESPONSES.OK) {
			handleDeletionSuccess(blogId, isDraft);
		} else if (response["status"] === SERVER_RESPONSES.UNAUTHORIZED) {
			toast.error("Token expired. Please login again");
			logOut();
		} else {
			handleResponse(response);
		}
	};

	const handleDeletionSuccess = (blogId, isDraft) => {
		const newState = isDraft
			? removeDraftFromSideDrawer(blogsTitleAndKeys, blogId)
			: removePublishedFromSideDrawer(blogsTitleAndKeys, blogId);

		setBlogsTitleAndKeys(newState);

		if (isDraft) {
			setCoverImg(null);
			navigateToDraft(newState);
		} else {
			handlePublishedBlogDeletion(newState);
		}
	};

	const handlePublishedBlogDeletion = (newState) => {
		if (hasMorePublishedBlogs(newState)) {
			setCurrentSelectedBlogKey(newState.publishedBlogs[0]["_id"]);
			navigate(`/edit/${newState.publishedBlogs[0]["_id"]}`);
		} else {
			setWasDraftWindow(isDraftWindow);
			navigateToDraft(newState);
		}
	};

	useEffect(() => {
		const loadBlogsTitleThenNavigate = async () => {
			setIsBlogsTitleLoading(true);

			const response = await fetchBlogsTitleAndKeys();

			if (!ignore) {
				if (response.status === SERVER_RESPONSES.OK) {
					const fetchedTitleAndKeys = response.titleAndKeys;
					const firstDraftId = fetchedTitleAndKeys.drafts[0]._id;

					setBlogsTitleAndKeys(fetchedTitleAndKeys);
					setCurrentSelectedBlogKey(firstDraftId);
					setIsBlogsTitleLoading(false);
					navigate(`/drafts/${firstDraftId}`);
				} else if (response.status === SERVER_RESPONSES.UNAUTHORIZED) {
					toast.error("Token expired. Please login again");
					logOut();
				} else {
					handleResponse(response);
				}
			}
		};

		let ignore = false;
		loadBlogsTitleThenNavigate();

		return () => {
			ignore = true;
		};
	}, []);

	if (isBlogsTitleLoading || blogsTitleAndKeys.length === 0)
		return <Spinner />;
	else {
		return (
			<>
				<div className="flex flex-col 2xl:items-center">
					<div className="2xl:w-4/5 flex flex-col flex-1 2xl:border-[1px] 2xl:border-solid">
						<SideDrawer
							isDrawerOpen={isDrawerOpen}
							setIsDrawerOpen={setIsDrawerOpen}
							blogsTitleAndKeys={blogsTitleAndKeys}
							currentSelectedBlogKey={currentSelectedBlogKey}
							setCurrentSelectedBlogKey={
								setCurrentSelectedBlogKey
							}
							setCurrentPublished={setCurrentPublished}
							setIsDraftWindow={setIsDraftWindow}
							isDraftWindow={isDraftWindow}
							setWasDraftWindow={setWasDraftWindow}
							handleNewDraftButtonClick={
								handleNewDraftButtonClick
							}
						/>

						<EditorToolbar
							setIsDrawerOpen={setIsDrawerOpen}
							handleSaveButtonClick={handleSaveButtonClick}
							handlePublishUpdateClick={handlePublishUpdateClick}
							isDraftWindow={isDraftWindow}
							isBlogActionLoading={isBlogActionLoading}
							currentSelectedBlogKey={currentSelectedBlogKey}
							setIsPreviewWindow={setIsPreviewWindow}
							isPreviewWindow={isPreviewWindow}
							handleSubmitForDraftPublish={
								handleSubmitForDraftPublish
							}
							handleBlogDeletion={handleBlogDeletion}
							setWasDraftWindow={setWasDraftWindow}
						/>

						<FormProvider {...methods}>
							<Outlet
								context={{
									setCurrentDraft,
									currentDraft,
									setCurrentPublished,
									currentPublished,
									setIsDraftWindow,
									isDraftWindow,
									coverImg,
									setCoverImg,
									setIsPreviewWindow,
									isBlogActionLoading,
									fetchBlogWithId,
									setIsCoverImgNull,
									wasDraftWindow,
								}}
							/>
						</FormProvider>
					</div>
				</div>
			</>
		);
	}
};
