import { Avatar, Button, Dropdown } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Spinner } from "../../../common/Spinner";

import { ReactComponent as BackArrowIcon } from "../../../assets/icons/back-arrow.svg";
import publishBlog from "../../../assets/images/publish-article.svg";

const items = [
	{
		label: "My Account",
		key: "0",
	},
	{
		type: "divider",
	},
	{
		label: "Log out",
		key: "3",
	},
];

export const BlogLayout = () => {
	const [isBlogLoading, setIsBlogLoading] = useState(false);
	const [currentBlog, setCurrentBlog] = useState(null);
	const { blogId } = useParams();

	useEffect(() => {
		const fetchBlog = async () => {
			setIsBlogLoading(true);
			let response;
			try {
				response = await fetch(
					`http://localhost:3000/blog/getsingleBlog/${blogId}`,
					{
						method: "GET",
					}
				);
				const json = await response.json();
				if (!ignore) {
					setIsBlogLoading(false);
					setCurrentBlog(json["blog"]);
				}
			} catch (error) {
				console.error("Error from DraftEditor\n\n", error);
			}
		};
		let ignore = false;
		fetchBlog();

		return () => {
			ignore = true;
		};
	}, [blogId]);
	if (isBlogLoading || currentBlog === null) {
		return <Spinner />;
	}
	return (
		<>
			<div className="navbar py-2 pr-4  flex justify-between items-center">
				<Button
					type="text"
					shape="round"
					icon={<BackArrowIcon className="w-6 h-auto" />}
				></Button>
				<span className="flex-2 text-center">{`${currentBlog["authorName"]}'s blog`}</span>

				<Dropdown menu={{ items }} trigger={["click"]}>
					<Avatar className="cursor-pointer">U</Avatar>
				</Dropdown>
			</div>
			<div className="for-desktop-container w-full lg:block border-2 border-solid border-green-700 lg:w-4/5 m-auto">
				<div className="h-48 w-full py-2 px-4 rounded-xl overflow-hidden flex-1 lg:h-80">
					<img
						src={publishBlog}
						className="w-full h-full object-cover"
					/>
				</div>
				<h1 className="py-2 px-4 mt-8">{currentBlog["title"]}</h1>
				<div className="flex flex-col py-2 px-4 gap-4 mb-8">
					<div className="flex items-center justify-center gap-4">
						<Avatar className="flex-[0_0_auto]">U</Avatar>
						<span className="text-xl whitespace-nowrap overflow-hidden">
							{currentBlog["authorName"]}
						</span>
					</div>
					<span className="text-center">
						{currentBlog["published_at"]}
					</span>
				</div>
				<div className="">
					<p>{currentBlog["content"]}</p>
				</div>
			</div>
		</>
	);
};
