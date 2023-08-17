import { Button } from "antd";
import Icon from "@ant-design/icons";
import PropTypes from "prop-types";

import { ReactComponent as DrawerIcon } from "../../../assets/icons/sidebar-drawer.svg";

export const EditorToolbar = ({ showDrawer }) => {
	return (
        // border-2 border-red-800 border-solid p-2
		<div className="editor-toolbar flex justify-between p-3 ">
			<Icon
				component={DrawerIcon}
				onClick={showDrawer}
			/>
			<Button type="primary" shape="round">Publish</Button>
		</div>
	);
};
EditorToolbar.propTypes = {
	showDrawer: PropTypes.func.isRequired,
};
