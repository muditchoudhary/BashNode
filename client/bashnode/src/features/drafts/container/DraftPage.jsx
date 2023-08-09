import { Button } from "antd";
import { useEffect } from "react";

import { SideDrawer } from "../components/SideDrawer";
import { useBlogs } from "../hooks/useBlogs";
import { useSideDrawer } from "../hooks/useSideDrawer";

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
	const { blogs, isLoading, setBlogsInitially, startLoading, stopLoading } = useBlogs();
	const { open, showDrawer, hideDrawer } = useSideDrawer();

	useEffect(() => {
		startLoading();
		fetch("http://localhost:3000/publish", {
			method: "GET",
			headers: {
				user: JSON.stringify({ email: "cmudit60@gmail.com" }),
			},
		})
			.then((response) => response.json())
			.then((fetchedBlogs) => {
				setBlogsInitially(fetchedBlogs);
				stopLoading();
			});
	}, []);

	if (isLoading) {
		return <div>loading...</div>;
	} else if (!isLoading && blogs) {
		return (
			<div className="draft-container">
				<SideDrawer open={open} onClose={hideDrawer} blogs={blogs} />
				<Button onClick={showDrawer}>Open</Button>
			</div>
		);
	}
};
