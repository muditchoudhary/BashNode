import { Button, Space } from "antd";
import PropTypes from "prop-types";

import { ReactComponent as DrawerIcon } from "../../../assets/icons/sidebar-drawer.svg";

export const EditorToolbar = ({
	setIsDrawerOpen,
	onSave,
	onPublishUpdate,
	isDraftWindow,
    isBlogFetchingOrSaving,
}) => {
	return (
		<div className="editor-toolbar flex justify-between p-3">
			<Button
				type="text"
				shape="round"
				icon={<DrawerIcon className="w-6 h-auto" />}
				onClick={() => setIsDrawerOpen(true)}
			></Button>

			{!isDraftWindow && (
				<Button type="primary" shape="round" onClick={onPublishUpdate} disabled={isBlogFetchingOrSaving}>
					Update
				</Button>
			)}

			{isDraftWindow && (
				<Space>
					<Button type="primary" shape="round" onClick={onSave} disabled={isBlogFetchingOrSaving}>
						Save
					</Button>
					<Button type="primary" shape="round" disabled={isBlogFetchingOrSaving}>
						Publish
					</Button>
				</Space>
			)}
		</div>
	);
};
EditorToolbar.propTypes = {
	setIsDrawerOpen: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
	onPublishUpdate: PropTypes.func.isRequired,
	isDraftWindow: PropTypes.bool.isRequired,
    isBlogFetchingOrSaving: PropTypes.bool.isRequired,
};
