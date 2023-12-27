import { Avatar, Dropdown, Space } from "antd";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import he from "he";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { toast } from "react-toastify";

import { Spinner } from "../../../common/Spinner";
import {
	menuItemsWhenLogIN,
	menuItemsWhenLogOut,
	SERVER_RESPONSES,
} from "../../../globalConstants/constants";
import { handleResponse } from "../../drafts/helpers/errorHandler";
import { useLogout } from "../../authenticaton/hooks/useLogOut";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { set } from "lodash";

const GET_PUBLISH_BLOG_URL = "http://localhost:3000/blog/getsingleBlog/";
const GET_BLOG_LIKES_URL = "http://localhost:3000/blog/publish/getLikes/";
const LIKE_BLOG_URL = "http://localhost:3000/blog/publish/like/";
const UNLIKE_BLOG_URL = "http://localhost:3000/blog/publish/unlike/";

export const BlogLayout = () => {
	const [isBlogLoading, setIsBlogLoading] = useState(false);
	const [currentBlog, setCurrentBlog] = useState(null);
	const [isLiked, setIsLiked] = useState(false);
	const [likes, setLikes] = useState(0);
	const [userAvatar, setUserAvatar] = useState(null);

	const { blogId } = useParams();

	const { logOut } = useLogout();
	const navigate = useNavigate();

	const { user } = useAuthContext();

	const handleLikeIconClick = async (isLiked) => {
		const action = isLiked ? "dislik" : "lik";
		const url = isLiked ? UNLIKE_BLOG_URL : LIKE_BLOG_URL;

		try {
			const response = await fetch(`${url}${blogId}`, {
				method: "PUT",
				mode: "cors",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${user}`,
				},
			});

			if (response.status === SERVER_RESPONSES.UNAUTHORIZED) {
				toast.error(`You need to be logged in to ${action}e this blog`);
				logOut();
                setIsLiked(false);
			} else if (response.status === SERVER_RESPONSES.OK) {
				const json = await response.json();
				setLikes(json.likes);
				setIsLiked(!isLiked);
			} else {
				handleResponse(response);
			}
		} catch (error) {
			console.error(error);
			toast.error(`Error occurred while ${action}ing blog`);
		}
	};

	const onAvtarIconClick = ({ key }) => {
		switch (key) {
			case "sign-up":
				navigate("/sign-up");
				break;
			case "sign-in":
				navigate("/sign-in");
				break;
			case "my-account":
				navigate("/dashboard");
				break;
			case "log-out":
				logOut();
				break;
		}
	};

	useEffect(() => {
		const fetchBlog = async () => {
			setIsBlogLoading(true);
			let response;
			try {
				response = await fetch(`${GET_PUBLISH_BLOG_URL}${blogId}`, {
					method: "GET",
				});
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

	useEffect(() => {
		const fetchLikes = async () => {
			let response;
			try {
				response = await fetch(`${GET_BLOG_LIKES_URL}${blogId}`, {
					method: "GET",
				});
				const json = await response.json();
				if (!ignore) {
					if (response.status === SERVER_RESPONSES.OK) {
						setLikes(json["likes"]);
						return;
					}
					handleResponse(response);
				}
			} catch (error) {
				console.error(error);
				toast.error("Error occurred while fetching likes");
			}
		};

		let ignore = false;
		fetchLikes();

		return () => {
			ignore = true;
		};
	}, [isLiked, blogId]);

	useEffect(() => {
		const fetchUserAvatarAndLikes = async () => {
			try {
				const response = await fetch(
					"http://localhost:3000/user/get-user-avatar-likes",
					{
						method: "GET",
						mode: "cors",
						credentials: "include",
						headers: {
							Authorization: `Bearer ${user}`,
						},
					}
				);

				const data =
					response.status === SERVER_RESPONSES.UNAUTHORIZED
						? {}
						: await response.json();

				if (response.status === SERVER_RESPONSES.OK) {
					setUserAvatar(data["avatar"]);
					if (data["liked_blogs"].includes(blogId)) {
						setIsLiked(true);
					}
				} else if (response.status === SERVER_RESPONSES.UNAUTHORIZED) {
					toast.error("Token expired. Please login again");
					logOut();
				} else if (
					response.status === SERVER_RESPONSES.INTERNAL_SERVER_ERROR
				) {
					toast.error(data["message"]);
				}
			} catch (error) {
				console.error(error);
				toast.error("Could not fetch user avatar", error);
			}
		};
		if (user) {
			fetchUserAvatarAndLikes();
		}
	}, [user]);

	if (isBlogLoading || currentBlog === null) {
		return <Spinner />;
	}
	return (
		<>
			<div className="navbar py-4 pr-4  flex justify-between items-center ">
				<span className="text-base md:text-xl lg:text-2xl 2xl:text-3xl font-bold font-roboto flex-2 text-center">{`${currentBlog["author_name"]}'s blog`}</span>

				{(user === false || user === null) && (
					<Dropdown
						menu={{
							items: menuItemsWhenLogOut,
							onClick: onAvtarIconClick,
						}}
						trigger={["click"]}
					>
						<Avatar className="cursor-pointer border border-solid border-gray-500">
							U
						</Avatar>
					</Dropdown>
				)}
				{user !== false && user !== null && (
					<Dropdown
						menu={{
							items: menuItemsWhenLogIN,
							onClick: onAvtarIconClick,
						}}
						trigger={["click"]}
					>
						{userAvatar === null || userAvatar === "" ? (
							<Avatar className="cursor-pointer border border-solid border-gray-500 ">
								U
							</Avatar>
						) : (
							<Avatar
								src={userAvatar}
								className="cursor-pointer border border-solid border-gray-500"
							/>
						)}
					</Dropdown>
				)}
			</div>
			{currentBlog["cover_img"] !== "" &&
				currentBlog["cover_img"] !== undefined && (
					<div className="h-[30vh] md:h-[40vh] lg:h-[55vh] 2xl:h-[65vh] py-2 px-4 rounded-xl">
						<img
							src={currentBlog["cover_img"]}
							className="w-full h-full object-cover lg:h-[60vh] lg:object-coverr"
						/>
					</div>
				)}

			<div className="for-desktop-container w-full lg:block lg:w-4/5 m-auto">
				<ReactMarkdown className=" py-2 px-4 mt-8 text-center leading-snug">{`# **${currentBlog["title"]}**`}</ReactMarkdown>
				<div className="flex flex-col py-2 px-4 gap-4 mb-8">
					<div className="flex items-center justify-center gap-4">
						{currentBlog["author_avatar"] === "" ||
							(currentBlog["author_avatar"] === undefined && (
								<Avatar className="border border-solid border-gray-500">
									U
								</Avatar>
							))}
						{currentBlog["author_avatar"] !== undefined &&
							currentBlog["author_avatar"] !== "" && (
								<Avatar
									src={currentBlog["author_avatar"]}
									className="border border-solid border-gray-500"
								/>
							)}
						<span className="text-xl whitespace-nowrap overflow-hidden">
							{currentBlog["author_name"]}
						</span>
					</div>
					<span className="text-center">
						{format(
							new Date(currentBlog["published_at"]),
							"dd-MMM-yyyy"
						)}
					</span>
				</div>
				<div className=" text-base md:text-lg lg:text-xl font-roboto  py-6 px-12 mt-8 ">
					<ReactMarkdown
						remarkPlugins={[remarkGfm]}
						// eslint-disable-next-line react/no-children-prop
						children={he.decode(currentBlog["content"])}
						components={{
							code(props) {
								// eslint-disable-next-line react/prop-types
								const { children, className, ...rest } = props;
								// const codeValue = children;
								// const match = /~~~(\w+)/.exec(codeValue);
								const match = /language-(\w+)/.exec(
									className || ""
								);
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
				<div className=" flex justify-center items-center py-4">
					<Space>
						{isLiked ? (
							<HeartFilled
								onClick={() => handleLikeIconClick(true)}
							/>
						) : (
							<HeartOutlined
								onClick={() => handleLikeIconClick(false)}
							/>
						)}
						<span>{likes}</span>
					</Space>
				</div>
			</div>
		</>
	);
};
