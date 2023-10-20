import { Button, Space } from "antd";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import { ReactComponent as DrawerIcon } from "../../../assets/icons/sidebar-drawer.svg";
import { ReactComponent as DeleteIcon } from "../../../assets/icons/delete.svg";

export const EditorToolbar = ({
	setIsDrawerOpen,
	onSave,
	onPublishUpdate,
	isDraftWindow,
	isBlogFetchingSavingUpdating,
	currentSelectedBlogKey,
	setIsPreviewWindow,
	isPreviewWindow,
	onDraftPublish,
	onDeleteBlog,
}) => {
	const navigate = useNavigate();
	return (
		<div className="editor-toolbar flex justify-between p-3">
			<Button
				type="text"
				shape="round"
				icon={<DrawerIcon className="w-6 h-auto" />}
				onClick={() => setIsDrawerOpen(true)}
			></Button>
			<Space>
				{!isDraftWindow && (
					<Space>
						<Button
							type="primary"
							shape="round"
							onClick={() => {
								if (isPreviewWindow) {
									navigate(`/edit/${currentSelectedBlogKey}`);
									setIsPreviewWindow(false);
								} else {
									navigate(
										`/preview/${currentSelectedBlogKey}`
									);
									setIsPreviewWindow(true);
								}
							}}
						>
							{isPreviewWindow ? "Edit" : "Preview"}
						</Button>
						<Button
							type="primary"
							shape="round"
							onClick={onPublishUpdate}
							disabled={isBlogFetchingSavingUpdating}
						>
							Update
						</Button>
					</Space>
				)}

				{isDraftWindow && (
					<Space>
						<Button
							type="primary"
							shape="round"
							onClick={() => {
								if (isPreviewWindow) {
									navigate(
										`/drafts/${currentSelectedBlogKey}`
									);
									setIsPreviewWindow(false);
								} else {
									navigate(
										`/preview/${currentSelectedBlogKey}`
									);
									setIsPreviewWindow(true);
								}
							}}
						>
							{isPreviewWindow ? "Edit" : "Preview"}
						</Button>
						<Button
							type="primary"
							shape="round"
							onClick={onSave}
							disabled={isBlogFetchingSavingUpdating}
						>
							Save
						</Button>
						<Button
							type="primary"
							shape="round"
							onClick={onDraftPublish}
							disabled={isBlogFetchingSavingUpdating}
						>
							Publish
						</Button>
					</Space>
				)}
				<Button
					type="text"
					shape="circle"
					icon={<DeleteIcon className="w-6 h-auto" />}
					onClick={() =>
						onDeleteBlog(currentSelectedBlogKey, isDraftWindow)
					}
				></Button>
			</Space>
		</div>
	);
};
EditorToolbar.propTypes = {
	setIsDrawerOpen: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
	onPublishUpdate: PropTypes.func.isRequired,
	isDraftWindow: PropTypes.bool.isRequired,
	isBlogFetchingSavingUpdating: PropTypes.bool.isRequired,
	currentSelectedBlogKey: PropTypes.string.isRequired,
	setIsPreviewWindow: PropTypes.func.isRequired,
	isPreviewWindow: PropTypes.bool.isRequired,
	onDraftPublish: PropTypes.func.isRequired,
	onDeleteBlog: PropTypes.func.isRequired,
};
