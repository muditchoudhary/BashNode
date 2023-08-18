import { Drawer } from "antd";
import PropTypes from "prop-types";

import { BlogsMenu } from "./BlogsMenu";
import { formatBlogList } from "../utils/menuItemHelpers.js";

import { ReactComponent as PageIcon } from "../../../assets/icons/page.svg";
import { ReactComponent as PublishedIcon } from "../../../assets/icons/page-done.svg";

const SIDE_DRAWER_PLACEMENT = "left";

export const SideDrawer = ({ isOpen, onCloseDrawer, blogs }) => {
	const drafts = formatBlogList(blogs.drafts, <PageIcon className=" w-4 " />);
	const published = formatBlogList(
		blogs.publishedBlogs,
		<PublishedIcon className=" w-4 " />
	);

	return (
		<Drawer
			placement={SIDE_DRAWER_PLACEMENT}
			maskClosable={true}
			onClose={onCloseDrawer}
			open={isOpen}
			key={SIDE_DRAWER_PLACEMENT}
		>
			<BlogsMenu drafts={drafts} published={published} />
		</Drawer>
	);
};
SideDrawer.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onCloseDrawer: PropTypes.func.isRequired,
	blogs: PropTypes.object.isRequired,
};
