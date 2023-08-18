export const createMenuItem = (label, key, icon, children, type) => {
	return {
		key,
		icon,
		children,
		label,
		type,
	};
};

export const formatBlogList = (blogList, icon) => {
	const formattedBlogList = blogList.map((blogObj) => {
		return createMenuItem(
			!blogObj.title ? "Untitled" : blogObj.title,
			blogObj._id,
			icon,
			null,
			null
		);
	});

	return formattedBlogList;
};
