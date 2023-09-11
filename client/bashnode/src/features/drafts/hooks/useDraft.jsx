import { useState } from "react";

import { useAuthContext } from "../../../hooks/useAuthContext";

export const useDraft = () => {
	const { user } = useAuthContext();

	const [isLoading, setIsLoading] = useState(null);
	const [isDraftSaved, setIsDraftSaved] = useState(null);
	const [serverErrors, setServerErrors] = useState(null);
	const [validationErrors, setValidationErrors] = useState(null);

	const handleSaveDraft = async (title, article) => {
		setIsLoading(true);
		let response;
		try {
			response = await fetch("http://localhost:3000/blog/draft/save", {
				method: "POST",
				mode: "cors",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
				body: JSON.stringify({
					title: title,
					content: article,
				}),
			});

			const json = await response.json();

			switch (response.status) {
				case 200:
					setIsLoading(false);
					setIsDraftSaved(true);
					console.log("success");
					break;
				// Validation issues
				case 409:
					setIsLoading(false);
					setValidationErrors(json.validationErrors);
					setIsDraftSaved(false);
					break;
				case 401:
					setIsLoading(false);
					setServerErrors({
						name: "Unauthorized",
						message: "Token expired plase sign in again",
					});
					setIsDraftSaved(false);
					break;
				case 500:
					setIsLoading(false);
					setIsDraftSaved(false);
					break;
			}
		} catch (error) {
			console.error("Error from useDraft\n\n", error);
			setIsLoading(false);
			setIsDraftSaved(false);
			setServerErrors(error);
		}
	};

	return {
		handleSaveDraft,
		isLoading,
		isDraftSaved,
		serverErrors,
		validationErrors,
	};
};
