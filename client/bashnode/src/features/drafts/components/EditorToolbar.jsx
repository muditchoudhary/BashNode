import { Button } from "antd";
import Icon from "@ant-design/icons";
import PropTypes from "prop-types";

import { ReactComponent as DrawerIcon } from "../../../assets/icons/sidebar-drawer.svg";

export const EditorToolbar = ({ showDrawer }) => {
	return (
		<div className="editor-toolbar flex justify-between border-2 border-red-800 border-solid p-2">
			<Icon
				component={DrawerIcon}
				onClick={showDrawer}
			/>
			<Button type="default">Publish</Button>
		</div>
	);
};
EditorToolbar.propTypes = {
	showDrawer: PropTypes.func.isRequired,
};
