import { Button } from "antd";

import { BlogsMenu } from "../components/BlogsMenu";
import { SideDrawer } from "../components/SideDrawer";
import { useSideDrawer } from "../hooks/useSideDrawer";

export const DraftPage = () => {
	const { open, onClose, showDrawer } = useSideDrawer();
	return (
		<div className="draft-container">
			<SideDrawer open={open} onClose={onClose} />
			<Button onClick={showDrawer}>Open</Button>
		</div>
	);
};
