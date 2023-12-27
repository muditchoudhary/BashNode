import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { createMenuItem } from "../helpers/sideDrawerHelper.js";

export const BlogsMenu = ({
	drafts,
	published,
	currentSelectedBlogKey,
	setCurrentSelectedBlogKey,
	setIsDraftWindow,
	isDraftWindow,
	setWasDraftWindow,
	handleNewDraftButtonClick,
}) => {
	const navigate = useNavigate();

	const menuItems = [
		createMenuItem("My Drafts", "drafts", null, drafts, null),
		createMenuItem("Published", "published", null, published, null),
		createMenuItem("Create New Draft", "newDraft", null, null, null),
	];

	const handleMenuItemClick = (key, isDraft) => {
		if (key === "newDraft") {
			handleNewDraftButtonClick();
		} else {
			setIsDraftWindow(isDraft);
			setCurrentSelectedBlogKey(key);

			const basePath = isDraft ? "/drafts" : "/edit";
			navigate(`${basePath}/${key}`);
		}
	};

	return (
		<Menu
			onClick={(e) => {
				setWasDraftWindow(isDraftWindow);
				handleMenuItemClick(e.key, e.keyPath[1] === "drafts");
			}}
			selectedKeys={[currentSelectedBlogKey]}
			defaultOpenKeys={["sub1"]}
			mode="inline"
			items={menuItems}
		/>
	);
};
BlogsMenu.propTypes = {
	drafts: PropTypes.array.isRequired,
	published: PropTypes.array.isRequired,
	currentSelectedBlogKey: PropTypes.string.isRequired,
	setCurrentSelectedBlogKey: PropTypes.func.isRequired,
	setIsDraftWindow: PropTypes.func.isRequired,
	isDraftWindow: PropTypes.bool.isRequired,
	setWasDraftWindow: PropTypes.func.isRequired,
	handleNewDraftButtonClick: PropTypes.func.isRequired,
};
