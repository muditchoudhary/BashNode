import { useForm, FormProvider } from "react-hook-form";
import { ConfigProvider } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { SideDrawer } from "../components/SideDrawer";
import { EditorToolbar } from "../components/EditorToolbar";
import { useFetchOrSaveBlog } from "../hooks/useFetchOrSaveBlog";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { Spinner } from "../../../common/Spinner";

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

export const DraftLayout = () => {
	const [blogsTitleAndKeys, setBlogsTitleAndKeys] = useState([]);
	const [isBlogsTitleLoading, setIsBlogsTitleLoading] = useState(false);
	const [currentSelectedBlogKey, setCurrentSelectedBlogKey] = useState(null);
	const [isPreviewWindow, setIsPreviewWindow] = useState(false);

	const [currentDraft, setCurrentDraft] = useState(null);
	const [currentPublished, setCurrentPublished] = useState(null);

	const [isDraftWindow, setIsDraftWindow] = useState(true);

	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const methods = useForm({
		mode: "onSubmit",
	});
	// const navigate = useNavigate();

	const { user } = useAuthContext();

	const { handleSaveDraft, handlePublishUpdate, isBlogFetchingOrSaving } =
		useFetchOrSaveBlog();

	const onSave = methods.handleSubmit(
		async (data) => {
			updateSideDrawerMenuItemTitle(currentDraft._id, data.title, true);
			handleSaveDraft(currentDraft._id, data.title, data.article);
		},
		(error) => {
			toast.error(error[Object.keys(error)[0]]["message"]);
		}
	);

	const onPublishUpdate = methods.handleSubmit(
		async (data) => {
			updateSideDrawerMenuItemTitle(
				currentPublished._id,
				data.title,
				false
			);
			handlePublishUpdate(currentPublished._id, data.title, data.article);
		},
		(error) => {
			toast.error(error[Object.keys(error)[0]]["message"]);
		}
	);

	const updateSideDrawerMenuItemTitle = (
		currentMenuItemKey,
		newTitle,
		isDraft
	) => {
		if (isDraft) {
			setBlogsTitleAndKeys((prevState) => {
				const updatedDrafts = prevState.drafts.map((draft) => {
					if (draft._id === currentMenuItemKey) {
						return { ...draft, title: newTitle };
					}
					return draft;
				});

				return { ...prevState, drafts: updatedDrafts };
			});
		} else {
			setBlogsTitleAndKeys((prevState) => {
				const updatedPublished = prevState.publishedBlogs.map(
					(published) => {
						if (published._id === currentMenuItemKey) {
							return { ...published, title: newTitle };
						}
						return published;
					}
				);

				return { ...prevState, publishedBlogs: updatedPublished };
			});
		}
	};

	useEffect(() => {
		const fetchBlogsTitleAndKeys = async () => {
			setBlogsTitleAndKeys(null);
			setIsBlogsTitleLoading(true);
			let response;
			try {
				response = await fetch(
					"http://localhost:3000/blog/getBlogsTitlesAndKeys",
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${user.token}`,
						},
					}
				);
				const json = await response.json();
				if (!ingnore) {
					setIsBlogsTitleLoading(false);
					setBlogsTitleAndKeys(json);
					setCurrentSelectedBlogKey(json["drafts"][0]["_id"]);
				}
			} catch (error) {
				console.error("Error from DraftLayout\n\n", error);
			}
		};
		let ingnore = false;
		fetchBlogsTitleAndKeys();

		return () => {
			ingnore = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (isBlogsTitleLoading || blogsTitleAndKeys.length === 0)
		return <Spinner />;
	else {
		return (
			<>
				<div className="draft-layout-container h-screen flex flex-col 2xl:flex 2xl:flex-col 2xl:items-center">
					<div className="draft-sub-container 2xl:w-4/5 flex flex-col flex-1 2xl:border-[1px] 2xl:border-solid">
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
						/>
						<ConfigProvider
							theme={{
								components: {
									Button: {
										fontSize: 14,
										controlHeight: 28,
									},
								},
							}}
						>
							<EditorToolbar
								setIsDrawerOpen={setIsDrawerOpen}
								onSave={onSave}
								onPublishUpdate={onPublishUpdate}
								isDraftWindow={isDraftWindow}
								isBlogFetchingOrSaving={isBlogFetchingOrSaving}
								currentSelectedBlogKey={currentSelectedBlogKey}
								setIsPreviewWindow={setIsPreviewWindow}
								isPreviewWindow={isPreviewWindow}
							/>
						</ConfigProvider>
						<FormProvider {...methods}>
							<Outlet
								context={{
									setCurrentDraft,
									currentDraft,
									setCurrentPublished,
									currentPublished,
									setCurrentSelectedBlogKey,
									setIsDraftWindow,
                                    isDraftWindow
								}}
							/>
						</FormProvider>
					</div>
				</div>
			</>
		);
	}
};
