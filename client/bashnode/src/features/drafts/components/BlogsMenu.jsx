import { Menu } from "antd";
import PropTypes from "prop-types";

import { createMenuItem } from "../utils/menuItemHelpers.js";

export const BlogsMenu = ({ drafts, published }) => {
	const menuItems = [
		createMenuItem("My Drafts", "sub1", null, drafts, null),
		createMenuItem("Published", "sub2", null, published, null),
	];
	const defaultSelectedKey = drafts.length ? drafts[0].key : null;

	return (
		<Menu
			onClick={(e) => {
				console.log("click:", e);
			}}
			defaultSelectedKeys={[defaultSelectedKey]}
			defaultOpenKeys={["sub1"]}
			mode="inline"
			items={menuItems}
		/>
	);
};
BlogsMenu.propTypes = {
	drafts: PropTypes.array.isRequired,
	published: PropTypes.array.isRequired,
};
