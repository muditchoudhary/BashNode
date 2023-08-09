export const getItem = (label, key, icon, children, type) => {
	return {
		key,
		icon,
		children,
		label,
		type,
	};
};

export const formatBlogObject = (blog, icon) => {
	const formatedBlog = blog.map((blogObj) => {
		return getItem(
			!blogObj.title ? "Untitled" : blogObj.title,
			blogObj._id,
			icon,
			null,
			null
		);
	});

	return formatedBlog;
};
