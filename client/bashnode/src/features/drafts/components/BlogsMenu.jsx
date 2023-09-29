import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { createMenuItem } from "../utils/menuItemHelpers.js";

export const BlogsMenu = ({
	drafts,
	published,
	currentSelectedBlogKey,
	setCurrentSelectedBlogKey,
	setIsDraftWindow,
}) => {
	const navigate = useNavigate();

	const menuItems = [
		createMenuItem("My Drafts", "drafts", null, drafts, null),
		createMenuItem("Published", "published", null, published, null),
	];

	return (
		<Menu
			onClick={(e) => {
				if (e["keyPath"][1] === "drafts") {
					setIsDraftWindow(true);
					navigate(`/drafts/${e["key"]}`);
				} else if (e["keyPath"][1] === "published") {
					setIsDraftWindow(false);
					navigate(`/edit/${e["key"]}`);
				}
				setCurrentSelectedBlogKey(e["key"]);
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
};
