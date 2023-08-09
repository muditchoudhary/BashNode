import { Drawer } from "antd";
import PropTypes from "prop-types";

import { BlogsMenu } from "./BlogsMenu";
import { formatBlogObject } from "../utils/formatBlogsData";

import { ReactComponent as PageIcon } from "../../../assets/icons/page.svg";
import {ReactComponent as PublishedIcon} from "../../../assets/icons/page-done.svg"

const DRAWER_PLACEMENT = "left";

export const SideDrawer = ({ open, onClose, blogs }) => {
	const drafts = formatBlogObject(
		blogs.drafts,
		<PageIcon className=" w-4 " />
	);
	const published = formatBlogObject(
		blogs.publishedBlogs,
		<PublishedIcon className=" w-4 " />
	);

	return (
		<Drawer
			placement={DRAWER_PLACEMENT}
			maskClosable={true}
			onClose={onClose}
			open={open}
			key={DRAWER_PLACEMENT}
		>
			<BlogsMenu drafts={drafts} published={published} />
		</Drawer>
	);
};
SideDrawer.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
    blogs: PropTypes.object.isRequired,
};
