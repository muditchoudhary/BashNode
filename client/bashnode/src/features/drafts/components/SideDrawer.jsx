import { Drawer } from "antd";
import PropTypes from "prop-types";

import { BlogsMenu } from "./BlogsMenu";

const DRAWER_PLACEMENT = "left";

export const SideDrawer = ({ open, onClose }) => {
	return (
		<Drawer
			placement={DRAWER_PLACEMENT}
			maskClosable={true}
			onClose={onClose}
			open={open}
			key={DRAWER_PLACEMENT}
		>
			<BlogsMenu />
		</Drawer>
	);
};
SideDrawer.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};
