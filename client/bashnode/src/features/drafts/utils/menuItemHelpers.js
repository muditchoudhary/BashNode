// For reference
// blogList =  [
    // 		{ title: "draft1", _id: "1" },
    // 		{ title: "draft2", _id: "2" },
    // 		{ title: "draft3", _id: "3" },
    // 		{ title: "draft4", _id: "4" },
    // 	],

// Convert the object into like this
// {"key": "_id of object", "icon": "icon component", "children": null, "label": "title of object", "type": null}

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
