import { useState } from "react";

import { useAuthContext } from "../../../hooks/useAuthContext";

export const useSignUp = (setMessage, setDescription, setType) => {
	const [serverErrors, setServerErrors] = useState(null);
	const [validationErrors, setValidationErrors] = useState(null);
	const [isLoading, setIsLoading] = useState(null);
	const { dispatch } = useAuthContext();
	const [isSignUpSuccessfull, setIsSignUpSuccessfull] = useState(false);

	const signUp = async (username, email, password) => {
		setIsLoading(true);
		setValidationErrors(null);
		let response;
		try {
			response = await fetch("http://localhost:3000/auth/sign-up", {
				method: "POST",
				mode: "cors",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username,
					email,
					password,
				}),
			});

			const json = await response.json();

			switch (response.status) {
				case 200:
					localStorage.setItem("user", JSON.stringify(json));
					dispatch({ type: "LOGIN", payload: json });
					setIsLoading(false);
					setIsSignUpSuccessfull(true);
					return 1; // success;
				// Validation issues
				case 409:
					setIsLoading(false);
					setValidationErrors(json.validationErrors);
					setIsSignUpSuccessfull(false);
					return 0; // validation issues
				// Internal server errors
				case 500:
					setServerErrors(json.message);
					setIsLoading(false);
					return -1; // server issues
			}
		} catch (error) {
			console.error("Error from userSignUp\n\n", error.message);
			setIsLoading(false);
			setIsSignUpSuccessfull(false);
			setServerErrors(error.message);
			setType("error");
			setMessage("Fetch failed");
			setDescription(
				"Please check your internet connection and try again"
			);
			return -1;
		}
	};

	return {
		signUp,
		isLoading,
		validationErrors,
		serverErrors,
		setServerErrors,
        isSignUpSuccessfull
	};
};
