import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";

import { SideDrawer } from "../components/SideDrawer";
import { useBlogsManagement } from "../hooks/useBlogsManagement";
import { useSideDrawerManagement } from "../hooks/useSideDrawerManagement";
import { EditorToolbar } from "../components/EditorToolbar";
import { EditorContainer } from "../components/editor-interface/EditorContainer";
import { useDraftActions } from "./useDraftActions";
import { ErrorDisplay } from "../components/ErrorDisplay";
// For reference
// const DEMO_BLOG_DATA = {
// 	drafts: [
// 		{ title: "draft1", _id: "1" },
// 		{ title: "draft2", _id: "2" },
// 		{ title: "draft3", _id: "3" },
// 		{ title: "draft4", _id: "4" },
// 	],
// 	published: [
// 		{ title: "published1", _id: "5" },
// 		{ title: "published1", _id: "6" },
// 	],
// };

export const DraftPage = () => {
	const {
		blogsData,
		isLoading,
		setInitialBlogsData,
		startLoading,
		stopLoading,
	} = useBlogsManagement();
	const { isDrawerOpen, openDrawer, closeDrawer } = useSideDrawerManagement();

	const methods = useForm({
		mode: "onSubmit",
	});
	const {
		formState: { errors },
	} = methods;

	const { showAlert, hideAlert, isAlertVisible } = useDraftActions();

	const onSave = methods.handleSubmit(
		async (data) => {
			console.log(data);
		},
		() => {
			showAlert();
		}
	);

	useEffect(() => {
		startLoading();
		fetch("http://localhost:3000/blog/draft", {
			method: "GET",
			headers: {
				user: JSON.stringify({ email: "cmudit60@gmail.com" }),
			},
		})
			.then((response) => response.json())
			.then((fetchedBlogs) => {
				setInitialBlogsData(fetchedBlogs);
				stopLoading();
			});
	}, []);

	if (isLoading) {
		return <div>loading...</div>;
	} else if (!isLoading && blogsData) {
		return (
			<div className="draft-container flex flex-col min-h-screen">
				{Object.keys(errors).length > 0 && isAlertVisible && (
					<ErrorDisplay errorMap={errors} onClose={hideAlert} />
				)}
				<SideDrawer
					isOpen={isDrawerOpen}
					onCloseDrawer={closeDrawer}
					blogs={blogsData}
				/>
				<FormProvider {...methods}>
					<EditorToolbar showDrawer={openDrawer} onSave={onSave} />
					<EditorContainer />
				</FormProvider>
			</div>
		);
	}
};
