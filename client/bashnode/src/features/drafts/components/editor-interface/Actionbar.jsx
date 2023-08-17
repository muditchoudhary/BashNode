import { Button, Space } from "antd";
import Icon from "@ant-design/icons";

import { ReactComponent as coverIcon } from "../../../../assets/icons/gallery.svg";

export const ActionBar = () => {
	return (
		// border-blue-800 border-solid border-2
		<div className="editor-action-bar p-3">
			<Button type="text" shape="round">
				<Space>
					<Icon component={coverIcon} className="text-transparent" />
					Add Cover
				</Space>
			</Button>
		</div>
	);
};
