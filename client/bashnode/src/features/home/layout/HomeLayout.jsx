import BashNodeIcon from "../../../assets/images/hashnode-icon.svg";
import { Button, Avatar } from "antd";


import { CardLoading } from "../components/CardLoading";
import { BlogCard } from "../components/BlogCard";

import { ReactComponent as WriteIcon } from "../../../assets/icons/writing.svg";
import { Posts } from "../components/Posts";

export const HomeLayout = () => {

	return (
		<>
			<div className="navbar-container flex 2xl:justify-center 2xl:items-center">
				<div className="navbar flex justify-between items-cente w-full 2xl:w-4/5 py-2 px-4 ">
					<div className="navbar_log p-1 md:flex md:justify-between md:items-center md:gap-3 md:p-1 2xl:gap-5 2xl:p-2">
						<img
							src={BashNodeIcon}
							alt="BashNode Icon"
							className="w-8 h-auto 2xl:w-10"
						/>
						<span className="hidden md:text-2xl md:font-bold md:block 2xl:text-4xl">
							BashNode
						</span>
					</div>
					<div className="navbar_options p-1 flex justify-between items-center gap-2">
						<Button
							type="text"
							shape="round"
							icon={<WriteIcon className="w-6 h-auto" />}
							className="md:hidden"
						></Button>
						<Button
							type="primary"
							shape="round"
							icon={<WriteIcon className="w-6 h-auto" />}
							className="hidden md:flex md:justify-center md:items-center"
						>
							Write
						</Button>
						<Avatar>U</Avatar>
					</div>
				</div>
			</div>
			<div className="published-blog-card-container flex flex-col gap-4 justify-center items-center py-2 px-4 pt-6 md:px-14 lg:px-28 xl:px-56 2xl:px-96 ">
				<Posts />
			</div>
		</>
	);
};
