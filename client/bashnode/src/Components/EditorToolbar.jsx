import Icon from "./Icon";
import sidebarDrawerIcon from "../assets/icons/sidebar-drawer.svg";

const EditorToolbar = () => {
	return (
		<>
			<div className="editor-toolbar flex justify-between p-2">
				<Icon
					icon={sidebarDrawerIcon}
					altIconText={"Sidebar drawer icon"}
				/>
				<button>Publish</button>
			</div>
		</>
	);
};

export default EditorToolbar;
