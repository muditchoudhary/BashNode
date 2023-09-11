import { useForm, FormProvider } from "react-hook-form";
import { ConfigProvider } from "antd";

import { useEffect, useState } from "react";

import { SideDrawer } from "../components/SideDrawer";
import { useSideDrawerManagement } from "../hooks/useSideDrawerManagement";
import { EditorToolbar } from "../components/EditorToolbar";
import { EditorContainer } from "../components/EditorContainer";
import { useAlert } from "../../../hooks/useAlert";
import { AlertBox } from "../../../components/AlertBox";
import { useDraft } from "../hooks/useDraft";
import { useBlogsManagement } from "../hooks/useBlogsManagement";
import { useAuthContext } from "../../../hooks/useAuthContext";

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

export const DraftLayout = () => {
	const {
		blogsData,
		isBlogLoading,
		setInitialBlogsData,
		startLoading,
		stopLoading,
	} = useBlogsManagement();

	const { isDrawerOpen, openDrawer, closeDrawer } = useSideDrawerManagement();

	const { user } = useAuthContext();

	const {
		message,
		description,
		type,
		setMessage,
		setDescription,
		setType,
		closeAlert,
	} = useAlert();

	const [showAlert, setShowAlert] = useState(false);

	const {
		handleSaveDraft,
		isLoading,
		isDraftSaved,
		serverErrors,
		validationErrors,
	} = useDraft();

	const methods = useForm({
		mode: "onSubmit",
	});

	const {
		formState: { errors },
	} = methods;

	const onSave = methods.handleSubmit(
		async (data) => {
			handleSaveDraft(data.title, data.article);
		},
		(error) => {
			// this method show user the client side validation errors issued by react-hook-form
			console.log(errors);
			setShowAlert(true);
			const firstErrorFieldName = Object.keys(error)[0];
			setType("error");
			setMessage(error[firstErrorFieldName]["type"].toUpperCase());
			setDescription(error[firstErrorFieldName]["message"]);
		}
	);

	useEffect(() => {
		const fetchData = async () => {
			startLoading();
			let response;
			try {
				response = await fetch("http://localhost:3000/blog/draft", {
					method: "GET",
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				});
				const json = await response.json();

				switch (response.status) {
					case 200:
						stopLoading();
						setInitialBlogsData(json);
						break;
				}
			} catch (error) {
				console.error("Error from DraftLayout\n\n", error);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		if (validationErrors) {
			const firstErrorFieldName = Object.keys(validationErrors)[0];
			setType("error");
			setMessage(
				validationErrors[firstErrorFieldName]["type"].toUpperCase()
			);
			setDescription(validationErrors[firstErrorFieldName]["message"]);
			setShowAlert(true);
		}
		if (serverErrors) {
			setType("error");
			setMessage(serverErrors["name"].toUpperCase());
			setDescription(serverErrors["message"]);
			setShowAlert(true);
		}
	}, [validationErrors, serverErrors]);

	if (blogsData === null || isBlogLoading) return "Loading...";
	else
		return (
			<>
				{showAlert && (
					<AlertBox
						message={message}
						description={description}
						type={"error"}
						closeAlert={() => {
							closeAlert();
							setShowAlert(false);
						}}
					/>
				)}
				<div className="draft-layout-container h-screen flex flex-col 2xl:flex 2xl:flex-col 2xl:items-center">
					<div className="draft-sub-container 2xl:w-4/5 flex flex-col flex-1 2xl:border-[1px] 2xl:border-solid">
						<SideDrawer
							isOpen={isDrawerOpen}
							onCloseDrawer={closeDrawer}
							blogs={blogsData}
						/>
						<FormProvider {...methods}>
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
									showDrawer={openDrawer}
									onSave={onSave}
								/>
							</ConfigProvider>
							<EditorContainer currentDraft={blogsData["drafts"][0]} />
						</FormProvider>
					</div>
				</div>
			</>
		);
};
