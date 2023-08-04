import { useState } from "react";

import { ReactComponent as PageIcon } from "../../../assets/icons/page.svg";

const getItem = (label, key, icon, children, type) => {
	return {
		key,
		icon,
		children,
		label,
		type,
	};
};

const INITIAL_MENU_ITEMS = [
	getItem("My Drafts", "sub1", null, [
		getItem("Draft1", "1", <PageIcon className=" w-4 " />),
		getItem("Draft2", "2", <PageIcon className=" w-4 " />),
	]),
	getItem("Published", "sub2", null, [
		getItem("Publish1", "3", <PageIcon className=" w-4 " />),
		getItem("Publish2", "4", <PageIcon className=" w-4 " />),
	]),
];

export const useBlogMenu = () => {
	const [draftsBlogs, setDraftsBlogs] = useState([]);
	const [publishedBlogs, setPublishedBlogs] = useState([]);
	const [blogMenuItems, setBlogMenuItems] = useState(INITIAL_MENU_ITEMS);
	return { blogMenuItems };
};
