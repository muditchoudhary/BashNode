import { useState } from "react";

export const useSideDrawer = () => {
	const [open, setOpen] = useState(false);
	const showDrawer = () => {
		setOpen(true);
	};
	const hideDrawer = () => {
		setOpen(false);
	};

	return { open, showDrawer, hideDrawer };
};
