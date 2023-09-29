import { Drawer } from "antd";
import PropTypes from "prop-types";

import { BlogsMenu } from "./BlogsMenu";
import { formatBlogList } from "../utils/menuItemHelpers.js";

import { ReactComponent as PageIcon } from "../../../assets/icons/page.svg";
import { ReactComponent as PublishedIcon } from "../../../assets/icons/page-done.svg";

const SIDE_DRAWER_PLACEMENT = "left";

export const SideDrawer = ({
	isDrawerOpen,
	setIsDrawerOpen,
	blogsTitleAndKeys,
	currentSelectedBlogKey,
	setCurrentSelectedBlogKey,
	setIsDraftWindow,
}) => {
	console.log(currentSelectedBlogKey);
	const drafts = formatBlogList(
		blogsTitleAndKeys["drafts"],
		<PageIcon className=" w-4 " />
	);
	const published = formatBlogList(
		blogsTitleAndKeys["publishedBlogs"],
		<PublishedIcon className=" w-4 " />
	);

	return (
		<Drawer
			placement={SIDE_DRAWER_PLACEMENT}
			maskClosable={true}
			onClose={() => setIsDrawerOpen(false)}
			open={isDrawerOpen}
			key={SIDE_DRAWER_PLACEMENT}
		>
			<BlogsMenu
				drafts={drafts}
				published={published}
				currentSelectedBlogKey={currentSelectedBlogKey}
				setCurrentSelectedBlogKey={setCurrentSelectedBlogKey}
				setIsDraftWindow={setIsDraftWindow}
			/>
		</Drawer>
	);
};
SideDrawer.propTypes = {
	isDrawerOpen: PropTypes.bool.isRequired,
	setIsDrawerOpen: PropTypes.func.isRequired,
	blogsTitleAndKeys: PropTypes.object.isRequired,
	currentSelectedBlogKey: PropTypes.string.isRequired,
	setCurrentSelectedBlogKey: PropTypes.func.isRequired,
	setIsDraftWindow: PropTypes.func.isRequired,
};
