import { useState } from "react";

import { makeRequest, handleResponse } from "../../../helpers/globalHelpers";
import {
	FETCH_STATUS,
	SERVER_RESPONSES,
    BACKEND_URL,
} from "../../../globalConstants/constants";
import { useAuthContext } from "../../../hooks/useAuthContext";

const GET_USER_AVATAR_URL = `${BACKEND_URL}user/get-user-avatar`;
const GET_USER_DETAILS_URL = `${BACKEND_URL}user/get-user-details`;
const UPDATE_USER_AVATAR_URL = `${BACKEND_URL}user/update-user-avatar`;

export const useUserDashboardActions = () => {
	const [isActionLoading, setIsActionLoading] = useState(false);

	const { user } = useAuthContext();

	const fetchUserAvatar = async () => {
		const { json, status, error } = await makeRequest(
			GET_USER_AVATAR_URL,
			null,
			"GET",
			setIsActionLoading,
			user
		);

		if (error) {
			console.error(error);
			return {
				status: FETCH_STATUS.FETCH_FAIL,
				errorMessage: `Could not fetch user avatar ${error}`,
			};
		} else if (json["success"] === true && status === SERVER_RESPONSES.OK) {
			return {
				status: status,
				avatar: json["avatar"],
			};
		}
		return handleResponse(json, status);
	};

	const fetchUserDetails = async () => {
		const { json, status, error } = await makeRequest(
			GET_USER_DETAILS_URL,
			null,
			"GET",
			setIsActionLoading,
			user
		);

		if (error) {
			return {
				status: FETCH_STATUS.FETCH_FAIL,
				errorMessage: `Could not fetch user details ${error}`,
			};
		} else if (json["success"] === true && status === SERVER_RESPONSES.OK) {
			return {
				status,
				details: json["details"],
			};
		}
		return handleResponse(json, status);
	};

	const updateUserAvatar = async (avatar, isUserAvatarNull) => {
		const formData = new FormData();
		formData.append("avatar", avatar);
		formData.append("isUserAvatarNull", isUserAvatarNull);

		const { json, status, error } = await makeRequest(
			UPDATE_USER_AVATAR_URL,
			formData,
			"PUT",
			setIsActionLoading,
			user
		);

		if (error) {
			return {
				status: FETCH_STATUS.FETCH_FAIL,
				errorMessage: `Could not update user avatar ${error}`,
			};
		}
		return handleResponse(json, status);
	};

	return {
		isActionLoading,
		fetchUserAvatar,
		fetchUserDetails,
		updateUserAvatar,
	};
};
