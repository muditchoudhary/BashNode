import { useState } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";

export const useSignIn = (setMessage, setDescription, setType) => {
	const [serverErrors, setServerErrors] = useState(null);
	const [validationErrors, setValidationErrors] = useState(null);
	const [isLoading, setIsLoading] = useState(null);
	const [isAuthSuccessfull, setIsAuthSuccessfull] = useState(false);

	const { dispatch } = useAuthContext();

	const handleAuth = async (email, password) => {
		setIsLoading(true);
		let response;
		try {
			response = await fetch("http://localhost:3000/auth/sign-in", {
				method: "POST",
				mode: "cors",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
				}),
			});
			const json = await response.json();

			switch (response.status) {
				// validation issues
				case 200:
					localStorage.setItem("user", JSON.stringify(json));
					dispatch({ type: "LOGIN", payload: json });
					setIsLoading(false);
					setIsAuthSuccessfull(true);
					break;
				case 409:
					setIsLoading(false);
					setValidationErrors(json.validationErrors);
					setIsAuthSuccessfull(false);
					break;
				case 500:
					setServerErrors(json.message);
					setIsLoading(false);
					setIsAuthSuccessfull(false);
					break;
			}
		} catch (error) {
			console.error("Error from useSignIn\n\n", error);
			setIsLoading(false);
			setIsAuthSuccessfull(false);
			setServerErrors(error.message);
			setType("error");
			setMessage(error.name);
			setDescription(error.message);
		}
	};

	return {
		handleAuth,
		isLoading,
		validationErrors,
		serverErrors,
		setServerErrors,
		isAuthSuccessfull,
	};
};
