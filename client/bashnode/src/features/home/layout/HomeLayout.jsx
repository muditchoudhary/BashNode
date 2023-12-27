import { Button, Avatar, Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { Posts } from "../components/Posts";
import { ReactComponent as WriteIcon } from "../../../assets/icons/writing.svg";
import BashNodeIcon from "../../../assets/images/hashnode-icon.svg";
import { useAuthContext } from "../../../hooks/useAuthContext";
import {
	SERVER_RESPONSES,
	menuItemsWhenLogIN,
	menuItemsWhenLogOut,
} from "../../../globalConstants/constants";
import { useLogout } from "../../authenticaton/hooks/useLogOut";
import { handleResponse } from "../../drafts/helpers/errorHandler";

export const HomeLayout = () => {
	const [userAvatar, setUserAvatar] = useState(null);

	const navigate = useNavigate();
	const { logOut } = useLogout();

	const handleOnPostClick = (id) => {
		window.open(`/blog/${id}`, "_blank");
	};

	const navigateToUserDashboard = () => {
		navigate("/dashboard");
	};

	const navigateToSignIn = () => {
		navigate("/sign-in");
	};

	const navigateToSignUp = () => {
		navigate("/sign-up");
	};

	const onAvtarIconClick = ({ key }) => {
		switch (key) {
			case "sign-up":
				navigateToSignUp();
				break;
			case "sign-in":
				navigateToSignIn();
				break;
			case "my-account":
				navigateToUserDashboard();
				break;
			case "log-out":
				logOut();
				break;
		}
	};

	const { user } = useAuthContext();

	useEffect(() => {
		const fetchUserAvatar = async () => {
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
				if (!ignore) {
                    if (response.status === SERVER_RESPONSES.OK) {
                        const data = await response.json();
                        setUserAvatar(data["avatar"]);
					} else if (
						response.status === SERVER_RESPONSES.UNAUTHORIZED
					) {
						toast.error("Token expired. Please login again");
                        logOut();
					} else {
						handleResponse(response);
					}
				}
			} catch (error) {
				console.error(error);
				toast.error("Could not fetch user avatar", error);
			}
		};
		let ignore = false;
		if (user !== false && user !== null) {
			fetchUserAvatar();
		}

		return () => {
			ignore = true;
		};
	}, [user]);
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
							onClick={() => {
								navigate("/drafts");
							}}
						></Button>
						<Button
							type="primary"
							shape="round"
							icon={<WriteIcon className="w-6 h-auto" />}
							className="hidden md:flex md:justify-center md:items-center"
							onClick={() => {
								navigate("/drafts");
							}}
						>
							Write
						</Button>
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
						)}
					</div>
				</div>
			</div>
			<div className="published-blog-card-container flex flex-col gap-4 justify-center items-center py-2 px-4 pt-6 md:px-14 lg:px-28 xl:px-56 2xl:px-96 ">
				<Posts handleOnPostClick={handleOnPostClick} />
			</div>
		</>
	);
};
