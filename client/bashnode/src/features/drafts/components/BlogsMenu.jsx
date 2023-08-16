import { Menu } from "antd";
import PropTypes from "prop-types";

import { getItem } from "../utils/formatBlogsData";

export const BlogsMenu = ({ drafts, published }) => {
	const menuItems = [
		getItem("My Drafts", "sub1", null, drafts, null),
		getItem("Published", "sub2", null, published, null),
	];
	const defautSelectedKey =
		!drafts.length ? null : drafts[0].key;

	return (
		<Menu
			onClick={(e) => {
				console.log("click:", e);
			}}
			defaultSelectedKeys={[defautSelectedKey]}
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
