import Icon from "./Icon";
import sidebarDrawerIcon from "../assets/icons/sidebar-drawer.svg";
import { usePublish } from "../hooks/usePublish";
import { useAuthContext } from "../hooks/useAuthContext";

const EditorToolbar = () => {
	const { publish, state } = usePublish();
	const { user } = useAuthContext();

	console.log("blogs State is: ", state);
    
	return (
		<>
			<div className="editor-toolbar flex justify-between p-2">
				<Icon
					icon={sidebarDrawerIcon}
					altIconText={"Sidebar drawer icon"}
				/>
				<button onClick={() => publish(user)}>Publish</button>
			</div>
		</>
	);
};

export default EditorToolbar;
