import { useState } from "react";
import { toast } from "react-toastify";

import { useAuthContext } from "../../../hooks/useAuthContext";

export const useFetchOrSaveBlog = () => {
	const [isBlogFetchingSavingUpdating, setIsBlogFetchingSavingUpdating] =
		useState(false);

	const { user } = useAuthContext();

	const makeRequest = async (url, body, method) => {
		let response;
		let json;
		let status;
		let error;
		try {
			setIsBlogFetchingSavingUpdating(true);
			response = await fetch(url, {
				method: method,
				mode: "cors",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
				body: JSON.stringify(body),
			});

			json = await response.json();
			status = response.status;
		} catch (e) {
			error = e;
		}
		setIsBlogFetchingSavingUpdating(false);
		return { json, status, error };
	};

	const handleServerResponse = (status, json, successMessage) => {
		switch (status) {
			case 200:
				toast.success(successMessage);
				break;
			// Validation issues
			case 409:
				// const firstField = Object.keys(json.validationErrors)[0];
				// let firstFieldValidationMsg = json.validationErrors[firstField]["msg"];
				toast.error(
					json.validationErrors[
						Object.keys(json.validationErrors)[0]
					]["msg"]
				);
				break;
			case 500:
				toast.error("Internal Server Error");
				break;
		}
	};

	const handleSaveDraft = async (draftId, title, article) => {
		const { json, status, error } = await makeRequest(
			"http://localhost:3000/blog/draft/save",
			{
				draftId: draftId,
				title: title,
				content: article,
			},
			"PUT"
		);
		if (error) {
			toast.error("Could not save draft", error);
		} else {
			handleServerResponse(status, json, "Draft Saved!!");
		}
	};

	const handlePublishUpdate = async (publishBlogId, title, article) => {
		const { json, status, error } = await makeRequest(
			"http://localhost:3000/blog/publish/update",
			{
				blogId: publishBlogId,
				title: title,
				content: article,
			},
			"PUT"
		);
		if (error) {
			console.error("Error from handlePublishUpdate\n\n", error);
			toast.error("Could not update the blog");
		} else {
			handleServerResponse(status, json, "Blog Updated!!");
		}
	};

	const handleDraftPublish = async (draftId, title, article) => {
		const { json, status, error } = await makeRequest(
			"http://localhost:3000/blog/draft/publish",
			{
				draftId: draftId,
				title: title,
				content: article,
			},
			"POST"
		);

		if (error) {
			return {
				status: -1,
				errorMessage: `Could not publisht the blog ${error}`,
			};
		} else if (json["success"] === false && status === 409) {
			return {
				status: status,
				errorMessage:
					json.validationErrors[
						Object.keys(json.validationErrors)[0]
					]["msg"],
			};
		} else if (
			(json["success"] === false && status === 500) ||
			status === 404
		) {
			return { status: status, errorMessage: json["message"] };
		} else if (json["success"] === true && status === 200) {
			return {
				status: status,
				publishedBlogId: json["blogId"],
				successMessage: json["message"],
			};
		}
	};

	return {
		handleSaveDraft,
		handlePublishUpdate,
		handleDraftPublish,
		isBlogFetchingSavingUpdating,
	};
};
