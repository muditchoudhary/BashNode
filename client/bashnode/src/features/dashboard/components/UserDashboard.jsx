import { Avatar, Button } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { useUserDashboardActions } from "../hooks/useUserDashboardActions";
import { SERVER_RESPONSES } from "../../../globalConstants/constants";
import { handleResponse } from "../../drafts/helpers/errorHandler";
import { Spinner } from "../../../common/Spinner";
import { useLogout } from "../../authenticaton/hooks/useLogOut";

const fileTypes = ["image/jpg", "image/jpeg", "image/png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILE_SIZE_MB = 5;

export const UserDashboard = () => {
	const [userName, setUserName] = useState(null);
	const [userEmail, setUserEmail] = useState(null);
	const [userAvatar, setUserAvatar] = useState(null);
	const [isUserAvatarNull, setIsUserAvatarNull] = useState(true);
	const [isUserDetailsFetching, setIsUserDetailsFetching] = useState(false);

	const { fetchUserDetails, isActionLoading, updateUserAvatar } =
		useUserDashboardActions();

	const { logOut } = useLogout();

	const navigate = useNavigate();

	useEffect(() => {
		const loadUserDetails = async () => {
			setIsUserDetailsFetching(true);
			const response = await fetchUserDetails();
			if (!ignore) {
				if (response.status === SERVER_RESPONSES.OK) {
					setUserAvatar(response.details["user_avatar"]);
					setUserName(response.details["username"]);
					setUserEmail(response.details["email"]);
					setIsUserDetailsFetching(false);
					if (response.details["user_avatar"] !== "") {
						setIsUserAvatarNull(false);
					}
				} else if (response.status === SERVER_RESPONSES.UNAUTHORIZED) {
					response["message"] = "Token expired. Please login again";
					logOut();
					navigate("/sign-in");
				}
				handleResponse(response);
			}
		};

		let ignore = false;
		loadUserDetails();

		return () => {
			ignore = true;
		};
	}, []);

	const validFileType = (file) => fileTypes.includes(file.type);
	const validFileSize = (file) => file.size <= MAX_FILE_SIZE;

	const handleAvatarUpdate = (e) => {
		const curFiles = e.target.files;

		const imgFile = curFiles[0];

		if (validFileType(imgFile)) {
			if (!validFileSize(imgFile)) {
				setUserAvatar(null);
				setIsUserAvatarNull(true);
				toast.error(
					`File size is too big. Please upload a file less than equal to ${MAX_FILE_SIZE_MB} MB.`
				);
				return;
			}
			setUserAvatar(imgFile);
			setIsUserAvatarNull(false);

			setUserAvatar(imgFile);
		} else {
			setUserAvatar(null);
			setIsUserAvatarNull(true);
			toast.error(
				"File type not supported. Please upload a .jpg, .jpeg, or .png file."
			);
		}
	};

	const handleSaveButtonClick = async () => {
		const userAvatarObj =
			typeof userAvatar === "string" ? null : userAvatar;
		const response = await updateUserAvatar(
			userAvatarObj,
			isUserAvatarNull
		);
		if (response.status === SERVER_RESPONSES.UNAUTHORIZED) {
			response["message"] = "Token expired. Please login again";
			logOut();
			navigate("/sign-in");
		}
		handleResponse(response);
	};
	if (isUserDetailsFetching) {
		return <Spinner />;
	} else {
		return (
			<>
				<div className="lg:flex border-2 border-solid border-black m-2">
					<div className="py-4 flex flex-col items-center gap-4 lg:flex-row lg:justify-center lg:w-2/5 ">
						{!userAvatar && (
							<div className="flex flex-col gap-4 items-center">
								<Avatar size={200} className="">
									U
								</Avatar>
								<label
									htmlFor="avatar"
									className="flex items-center gap-3 w-fit hover:bg-[#0000000f] text-base rounded-3xl cursor-pointer"
								>
									Update Avatar
								</label>
								<input
									type="file"
									id="avatar"
									name="avatar"
									accept=".jpg, .jpeg, .png"
									className="w-0 opacity-0"
									onChange={handleAvatarUpdate}
									disabled={isActionLoading}
								/>
							</div>
						)}
						{userAvatar && (
							<div className="flex flex-col gap-4">
								<Avatar
									size={200}
									src={
										typeof userAvatar === "object"
											? URL.createObjectURL(userAvatar)
											: userAvatar
									}
									className="border-2 border-solid border-black"
								/>
								<Button
									type="primary"
									shape="round"
									danger
									onClick={() => {
										setUserAvatar(null);
										setIsUserAvatarNull(true);
									}}
									disabled={isActionLoading}
								>
									Remove Avatar
								</Button>
							</div>
						)}
					</div>
					<div className="mt-20 py-4 lg:mt-0 lg:justify-center flex flex-col items-center gap-4 lg:w-3/5 text-lg md:text-xl lg:text-2xl 2xl:text-3xl font-roboto">
						<p className="underline">{userName}</p>
						<p className="underline">{userEmail}</p>
						<Button
							type="primary"
							size="large"
							onClick={handleSaveButtonClick}
							disabled={isActionLoading}
						>
							Save
						</Button>
					</div>
				</div>
			</>
		);
	}
};
