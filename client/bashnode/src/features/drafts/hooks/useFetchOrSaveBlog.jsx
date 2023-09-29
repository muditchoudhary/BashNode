import { useState } from "react";
import { toast } from "react-toastify";

import { useAuthContext } from "../../../hooks/useAuthContext";

export const useFetchOrSaveBlog = () => {
	const [isBlogFetchingOrSaving, setIsBlogFetchingOrSaving] = useState(false);

	const { user } = useAuthContext();

	const makeRequest = async (url, body) => {
		let response;
		let json;
		let status;
		let error;
		try {
			setIsBlogFetchingOrSaving(true);
			response = await fetch(url, {
				method: "POST",
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
			console.error("Error from makeRequest\n\n", e);
			error = e;
		}
		setIsBlogFetchingOrSaving(false);
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
			}
		);
		if (error) {
			console.error("Error from handleSaveDraft\n\n", error);
			toast.error("Could not save draft");
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
			}
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
			}
		);

		if (error) {
			console.error("Error from handleDraftPublish\n\n", error);
			toast.error("Could not publish the draft");
		} else {
			handleServerResponse(status, json, "Draft Published!!");
		}
	};

	return {
		handleSaveDraft,
		handlePublishUpdate,
		handleDraftPublish,
		isBlogFetchingOrSaving,
	};
};
