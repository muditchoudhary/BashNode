import { Button, Space } from "antd";
import PropTypes from "prop-types";

import { ReactComponent as DrawerIcon } from "../../../assets/icons/sidebar-drawer.svg";

export const EditorToolbar = ({ showDrawer, onSave }) => {
	return (
		<div className="editor-toolbar flex justify-between p-3">
			<Button
				type="text"
				shape="round"
				icon={<DrawerIcon className="w-6 h-auto" />}
				onClick={showDrawer}
			></Button>

			<Space>
				<Button type="primary" shape="round" onClick={onSave}>
					Save
				</Button>
				<Button type="primary" shape="round">
					Publish
				</Button>
			</Space>
		</div>
	);
};
EditorToolbar.propTypes = {
	showDrawer: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
};
