import { Button, Space } from "antd";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { ReactComponent as DrawerIcon } from "../../../assets/icons/sidebar-drawer.svg";
import { ReactComponent as DeleteIcon } from "../../../assets/icons/delete.svg";

export const EditorToolbar = ({
	setIsDrawerOpen,
	handleSaveButtonClick,
	handlePublishUpdateClick,
	isDraftWindow,
	isBlogActionLoading,
	currentSelectedBlogKey,
	setIsPreviewWindow,
	isPreviewWindow,
	handleSubmitForDraftPublish,
	handleBlogDeletion,
	setWasDraftWindow,
}) => {
	const navigate = useNavigate();

	const handlePreviewEditToggle = () => {
		let newPath;
		if (isDraftWindow) {
			newPath = isPreviewWindow ? "/drafts" : "/preview";
			setWasDraftWindow(isDraftWindow);
		} else {
			newPath = isPreviewWindow ? "/edit" : "/preview";
			setWasDraftWindow(isDraftWindow);
		}
		navigate(`${newPath}/${currentSelectedBlogKey}`);
		setIsPreviewWindow(!isPreviewWindow);
	};

	return (
		<div className="flex px-2 justify-between py-2">
			<Button
				type="text"
				shape="square"
				icon={<DrawerIcon className="w-6 h-auto" />}
				onClick={() => setIsDrawerOpen(true)}
				disabled={isBlogActionLoading}
			></Button>
			<Space size="small">
				{isDraftWindow && (
					<>
						<Button
							type="primary"
							shape="round"
							onClick={handlePreviewEditToggle}
							disabled={isBlogActionLoading}
						>
							{isPreviewWindow ? "Edit" : "Preview"}
						</Button>
						<Button
							type="primary"
							shape="round"
							onClick={handleSaveButtonClick}
							disabled={isBlogActionLoading}
						>
							Save
						</Button>
						<Button
							type="primary"
							shape="round"
							onClick={handleSubmitForDraftPublish}
							disabled={isBlogActionLoading}
						>
							Publish
						</Button>
					</>
				)}

				{!isDraftWindow && (
					<>
						<Button
							type="primary"
							shape="round"
							onClick={handlePreviewEditToggle}
							disabled={isBlogActionLoading}
						>
							{isPreviewWindow ? "Edit" : "Preview"}
						</Button>
						<Button
							type="primary"
							shape="round"
							onClick={handlePublishUpdateClick}
							disabled={isBlogActionLoading}
						>
							Update
						</Button>
					</>
				)}

				<Button
					type="text"
					shape="square"
					icon={<DeleteIcon className="w-6 h-auto" />}
					onClick={() =>
						handleBlogDeletion(
							currentSelectedBlogKey,
							isDraftWindow
						)
					}
					disabled={isBlogActionLoading}
				></Button>
			</Space>
		</div>
	);
};

EditorToolbar.propTypes = {
	setIsDrawerOpen: PropTypes.func.isRequired,
	handleSaveButtonClick: PropTypes.func.isRequired,
	handlePublishUpdateClick: PropTypes.func.isRequired,
	isDraftWindow: PropTypes.bool.isRequired,
	isBlogActionLoading: PropTypes.bool.isRequired,
	currentSelectedBlogKey: PropTypes.string.isRequired,
	setIsPreviewWindow: PropTypes.func.isRequired,
	isPreviewWindow: PropTypes.bool.isRequired,
	handleSubmitForDraftPublish: PropTypes.func.isRequired,
	handleBlogDeletion: PropTypes.func.isRequired,
	setWasDraftWindow: PropTypes.func.isRequired,
};
