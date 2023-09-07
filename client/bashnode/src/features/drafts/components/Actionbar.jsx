import { Button } from "antd";

import { ReactComponent as AddCoverIcon } from "../../../assets/icons/gallery.svg";

export const ActionBar = () => {
	return (
		<div className="editor-action-bar p-3">
			<Button
				type="text"
				shape="round"
				icon={<AddCoverIcon className="w-6 h-auto" />}
				className="flex justify-center items-center text-xl"
			>
				Add Cover
			</Button>
		</div>
	);
};
