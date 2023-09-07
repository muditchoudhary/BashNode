import { useForm, FormProvider } from "react-hook-form";
import { ConfigProvider } from "antd";

import { SideDrawer } from "../components/SideDrawer";

import { useSideDrawerManagement } from "../hooks/useSideDrawerManagement";
import { EditorToolbar } from "../components/EditorToolbar";
import { EditorContainer } from "../components/EditorContainer";


// For reference
const DEMO_BLOG_DATA = {
	drafts: [
		{ title: "draft1", _id: "1" },
		{ title: "draft2", _id: "2" },
		{ title: "draft3", _id: "3" },
		{ title: "draft4", _id: "4" },
	],
	publishedBlogs: [
		{ title: "published1", _id: "5" },
		{ title: "published1", _id: "6" },
	],
};

/** export const DraftLayout = () => {
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
}; **/

export const DraftLayout = () => {
	// const {
	// 	blogsData,
	// 	isLoading,
	// 	setInitialBlogsData,
	// 	startLoading,
	// 	stopLoading,
	// } = useBlogsManagement();

	const { isDrawerOpen, openDrawer, closeDrawer } = useSideDrawerManagement();

	const methods = useForm({
		mode: "onSubmit",
	});

	const {
		formState: { errors },
	} = methods;

	const onSave = methods.handleSubmit(async (data) => {
		console.log(data);
	});

	return (
		<>
			<div className="draft-layout-container h-screen flex flex-col 2xl:flex 2xl:flex-col 2xl:items-center">
				<div className="draft-sub-container 2xl:w-4/5 flex flex-col flex-1 2xl:border-[1px] 2xl:border-solid">
					<SideDrawer
						isOpen={isDrawerOpen}
						onCloseDrawer={closeDrawer}
						blogs={DEMO_BLOG_DATA}
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
						<EditorContainer />
					</FormProvider>
				</div>
			</div>
		</>
	);
};
