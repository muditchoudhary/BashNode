import he from "he";

// This function updates the title of a menu item in the side drawer.
export const updateMenuItemTitleInSideDrawer = (currentMenuItemKey, newTitle, isDraft, setBlogsTitleAndKeys) => {
    setBlogsTitleAndKeys(prevState => {
        const updatedItems = isDraft
            ? prevState.drafts.map(draft =>
                draft._id === currentMenuItemKey ? { ...draft, title: newTitle } : draft
            )
            : prevState.publishedBlogs.map(published =>
                published._id === currentMenuItemKey ? { ...published, title: newTitle } : published
            );

        return isDraft
            ? { ...prevState, drafts: updatedItems }
            : { ...prevState, publishedBlogs: updatedItems };
    });
};

export const removeDraftFromSideDrawer = (prevState, draftId) => {
    const updatedDrafts = prevState.drafts.filter((draft) => draft._id !== draftId);
    return { ...prevState, drafts: updatedDrafts };
};

export const removePublishedFromSideDrawer = (prevState, publishedId) => {
    const updatedPublishedBlogs = prevState.publishedBlogs.filter((published) => published._id !== publishedId);
    return { ...prevState, publishedBlogs: updatedPublishedBlogs };
};

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
			!blogObj.title ? "Untitled" : he.decode(blogObj.title),
			blogObj._id,
			icon,
			null,
			null
		);
	});

	return formattedBlogList;
};


