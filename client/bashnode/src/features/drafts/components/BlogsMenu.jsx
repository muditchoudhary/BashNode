import { Menu } from "antd";
import { useBlogMenu } from "../hooks/useBlogMenu";

export const BlogsMenu = () => {
    const {blogMenuItems} = useBlogMenu();

	return (
		<Menu
			onClick={(e) => {
				console.log("click:", e);
			}}
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            items={blogMenuItems}
		/>
	);
};
