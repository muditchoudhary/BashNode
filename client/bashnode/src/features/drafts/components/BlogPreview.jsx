import { useOutletContext } from "react-router-dom";
import { Avatar, Dropdown, Space } from "antd";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { HeartOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import he from "he";

import { useUserDashboardActions } from "../../dashboard/hooks/useUserDashboardActions";
import { SERVER_RESPONSES } from "../../../globalConstants/constants";
import { handleResponse } from "../../drafts/helpers/errorHandler";
import { useLogout } from "../../authenticaton/hooks/useLogOut";
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

function getCurrentFormattedDate() {
	const date = new Date();

	// Helper function to pad numbers with leading zeros
	const padZero = (num) => String(num).padStart(2, "0");

	const day = padZero(date.getDate());
	const monthNames = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	const month = monthNames[date.getMonth()];
	const year = date.getFullYear();

	return `${day}-${month}-${year}`;
}

export const BlogPreview = () => {
	const [isUserDetailsFetching, setIsUserDetailsFetching] = useState(false);
	const [userName, setUserName] = useState(null);
	const [userAvatar, setUserAvatar] = useState(null);

	const { fetchUserDetails } = useUserDashboardActions();
	const { logOut } = useLogout();

	const { currentDraft, currentPublished, isDraftWindow, coverImg } =
		useOutletContext();

	const currentBlog = isDraftWindow ? currentDraft : currentPublished;
	const title = currentBlog === null ? "" : currentBlog["title"];
	const content = currentBlog === null ? "" : currentBlog["content"];

	useEffect(() => {
		const loadUserDetails = async () => {
			setIsUserDetailsFetching(true);
			const response = await fetchUserDetails();

			if (!ignore) {
				if (response.status === SERVER_RESPONSES.OK) {
					setUserAvatar(response.details["user_avatar"]);
					setUserName(response.details["username"]);
					setIsUserDetailsFetching(false);
				} else if (response.status === SERVER_RESPONSES.UNAUTHORIZED) {
					toast.error("Token expired. Please login again");
					logOut();
				} else {
					handleResponse(response);
				}
			}
		};

		let ignore = false;
		loadUserDetails();

		return () => {
			ignore = true;
		};
	}, []);

	return (
		<>
			<div className="w-full mx-auto mt-8 border-2 border-solid border-black">
				<div className="py-2 pr-4  flex justify-between items-center">
					<span className="text-base md:text-xl lg:text-2xl 2xl:text-3xl font-bold font-roboto  flex-2 text-center">{`${userName}'s Blog`}</span>

					<Dropdown
						menu={{
							items: items,
						}}
						trigger={["click"]}
					>
						{userAvatar === null || userAvatar === "" ? (
							<Avatar className="cursor-pointer border border-solid border-gray-500">
								U
							</Avatar>
						) : (
							<Avatar
								src={userAvatar}
								className="cursor-pointer border border-solid border-gray-500"
							/>
						)}
					</Dropdown>
				</div>
				{coverImg !== null && coverImg !== "" && (
					<div className="h-[30vh] md:h-[40vh] lg:h-[55vh] 2xl:h-[65vh] py-2 px-4 rounded-xl">
						<img
							src={
								typeof coverImg === "object"
									? URL.createObjectURL(coverImg)
									: coverImg
							}
							className="w-full h-full object-cover lg:h-[60vh] lg:object-cover"
							alt="Cover Preview"
						/>
					</div>
				)}

				<ReactMarkdown className=" py-2 px-4 mt-8 text-center leading-snug">{`# **${title}**`}</ReactMarkdown>
				<div className="flex flex-col py-2 px-4 gap-4 mb-8">
					<div className="flex items-center justify-center gap-4">
						{userAvatar === null || userAvatar === "" ? (
							<Avatar className="cursor-pointer border border-solid border-gray-500">
								U
							</Avatar>
						) : (
							<Avatar
								src={userAvatar}
								className="cursor-pointer border border-solid border-gray-500"
							/>
						)}
						<span className="text-xl whitespace-nowrap overflow-hidden">
							{userName}
						</span>
					</div>
					<span className="text-center">
						{getCurrentFormattedDate()}
					</span>
				</div>
				<div className="text-base md:text-lg lg:text-xl font-roboto  py-6 px-12 mt-8">
					<ReactMarkdown
						remarkPlugins={[remarkGfm]}
						// eslint-disable-next-line react/no-children-prop
						children={he.decode(content)}
						components={{
							code(props) {
								// eslint-disable-next-line react/prop-types
								const { children, className, ...rest } = props;
								// const codeValue = children;
								// const match = /~~~(\w+)/.exec(codeValue);
								const match = /language-(\w+)/.exec(
									className || ""
								);
								// console.log(match)
								return match ? (
									<SyntaxHighlighter
										{...rest}
										// eslint-disable-next-line react/no-children-prop
										children={String(children).replace(
											/\n$/,
											""
										)}
										language={match[1]}
										PreTag="div"
									/>
								) : (
									<code {...rest} className={className}>
										{children}
									</code>
								);
							},
						}}
					/>
				</div>
				<div className="flex justify-center items-center py-4">
					<Space>
						<HeartOutlined />
						<span>0</span>
					</Space>
				</div>
			</div>
		</>
	);
};
