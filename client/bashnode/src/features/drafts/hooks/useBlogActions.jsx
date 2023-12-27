import { useState } from "react";

import { useAuthContext } from "../../../hooks/useAuthContext";
import { SERVER_RESPONSES, FETCH_STATUS, BACKEND_URL } from "../../../globalConstants/constants";
import { handleResponse, makeRequest } from "../../../helpers/globalHelpers";

const SAVE_DRAFT_API_URL = `${BACKEND_URL}blog/draft/save`;
const PUBLISH_UPDATE_API_URL = `${BACKEND_URL}blog/publish/update`;
const DRAFT_PUBLISH_API_URL = `${BACKEND_URL}blog/draft/publish`;
const GET_BLOGS_TITLES_AND_KEYS_API_URL =
	`${BACKEND_URL}blog/getBlogsTitlesAndKeys`;
const CREATE_NEW_DRAFT_API_URL = `${BACKEND_URL}blog/draft/create`;

export const useBlogActions = () => {
	const [isBlogActionLoading, setIsBlogActionLoading] = useState(false);

	const { user } = useAuthContext();

	const handleSaveDraft = async (
		draftId,
		title,
		article,
		coverImg,
		isCoverImgNull
	) => {
		const formData = new FormData();
		formData.append("draftId", draftId);
		formData.append("title", title);
		formData.append("content", article);
		formData.append("coverImg", coverImg);
		formData.append("isCoverImgNull", isCoverImgNull);

		const { json, status, error } = await makeRequest(
			SAVE_DRAFT_API_URL,
			formData,
			"PUT",
			setIsBlogActionLoading,
			user
		);
		if (error) {
			console.error(error);
			return {
				status: FETCH_STATUS.FETCH_FAIL,
				message: `"Could not save draft" ${error}`,
			};
		}
		return handleResponse(json, status);
	};

	const handlePublishUpdate = async (
		publishBlogId,
		title,
		article,
		coverImg,
		isCoverImgNull
	) => {
		const formData = new FormData();
		formData.append("blogId", publishBlogId);
		formData.append("title", title);
		formData.append("content", article);
		formData.append("coverImg", coverImg);
		formData.append("isCoverImgNull", isCoverImgNull);

		const { json, status, error } = await makeRequest(
			PUBLISH_UPDATE_API_URL,
			formData,
			"PUT",
			setIsBlogActionLoading,
			user
		);
		if (error) {
			console.error(error);
			return {
				status: FETCH_STATUS.FETCH_FAIL,
				message: `"Could not update the blog" ${error}`,
			};
		}
		return handleResponse(json, status);
	};

	const handleDraftPublish = async (
		draftId,
		title,
		article,
		coverImg,
		isCoverImgNull
	) => {
		const formData = new FormData();
		formData.append("draftId", draftId);
		formData.append("title", title);
		formData.append("content", article);
		formData.append("coverImg", coverImg);
		formData.append("isCoverImgNull", isCoverImgNull);
		const { json, status, error } = await makeRequest(
			DRAFT_PUBLISH_API_URL,
			formData,
			"POST",
			setIsBlogActionLoading,
			user
		);
		if (error) {
			console.error(error);
			return {
				status: FETCH_STATUS.FETCH_FAIL,
				message: `Could not publish the blog ${error}`,
			};
		}
		if (status === SERVER_RESPONSES.OK) {
			return {
				status: status,
				publishedBlogId: json["blogId"],
				successMessage: json["message"],
			};
		}
		return handleResponse(json, status);
	};

	const handleBlogDelete = async (blogId, url) => {
		const { json, status, error } = await makeRequest(
			`${url}/${blogId}`,
			null,
			"DELETE",
			setIsBlogActionLoading,
			user
		);

		if (error) {
			console.error(error);
			return {
				status: FETCH_STATUS.FETCH_FAIL,
				message: `Could not delete the blog ${error}`,
			};
		}
		return handleResponse(json, status);
	};

	const fetchBlogsTitleAndKeys = async () => {
		const { json, status, error } = await makeRequest(
			GET_BLOGS_TITLES_AND_KEYS_API_URL,
			null,
			"GET",
			setIsBlogActionLoading,
			user
		);
		if (error) {
			console.error(error);
			return {
				status: FETCH_STATUS.FETCH_FAIL,
				message: `Could not fetch titles ${error}`,
			};
		} else if (json["success"] === true && status === SERVER_RESPONSES.OK) {
			return {
				status: status,
				titleAndKeys: json["titleAndKeys"],
			};
		}
		return handleResponse(json, status);
	};

	const fetchBlogWithId = async (getBlogURL) => {
		const { json, status, error } = await makeRequest(
			getBlogURL,
			null,
			"GET",
			setIsBlogActionLoading,
			user
		);
		if (error) {
			console.error(error);
			return {
				status: FETCH_STATUS.FETCH_FAIL,
				message: `Could not fetch draft ${error}`,
			};
		} else if (json["success"] === true && status === SERVER_RESPONSES.OK) {
			return {
				status: status,
				blog: json["blog"],
			};
		}
		return handleResponse(json, status);
	};

	const createNewDraft = async () => {
		const { json, status, error } = await makeRequest(
			CREATE_NEW_DRAFT_API_URL,
			null,
			"POST",
			setIsBlogActionLoading,
			user
		);
		if (error) {
			console.error(error);
			return {
				status: FETCH_STATUS.FETCH_FAIL,
				message: `Could not create new draft ${error}`,
			};
		} else if (json["success"] === true && status === SERVER_RESPONSES.OK) {
			return {
				status: status,
				successMessage: json["message"],
				draft: json["draft"],
			};
		}
		return handleResponse(json, status);
	};

	return {
		handleSaveDraft,
		handlePublishUpdate,
		handleDraftPublish,
		isBlogActionLoading,
		handleBlogDelete,
		fetchBlogsTitleAndKeys,
		fetchBlogWithId,
		createNewDraft,
	};
};
