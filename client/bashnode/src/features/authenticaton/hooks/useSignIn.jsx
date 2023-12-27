import { useState } from "react";

import { useAuthContext } from "../../../hooks/useAuthContext";
import { SERVER_RESPONSES, FETCH_STATUS, BACKEND_URL} from "../../../globalConstants/constants";

const SIGN_IN_URL = `${BACKEND_URL}auth/sign-in`;

export const useSignIn = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [validationErrors, setValidationErrors] = useState(null);
	const [isAuthSuccessfull, setIsAuthSuccessfull] = useState(false);

	const { dispatch } = useAuthContext();

	const handleAuth = async (email, password) => {
		setIsLoading(true);
		let response;
		try {
			response = await fetch(SIGN_IN_URL, {
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
				case SERVER_RESPONSES.OK:
					localStorage.setItem("user", JSON.stringify(json["token"]));
					dispatch({ type: "LOGIN", payload: json["token"] });
					setIsLoading(false);
					setIsAuthSuccessfull(true);
					return {
						status: SERVER_RESPONSES.OK,
					};
				case SERVER_RESPONSES.VALIDATION_CONFLICT:
					setIsLoading(false);
					setValidationErrors(json.validationErrors);
                    setIsAuthSuccessfull(false);
					return {
						status: SERVER_RESPONSES.VALIDATION_CONFLICT,
					};
				case SERVER_RESPONSES.INTERNAL_SERVER_ERROR:
					setIsLoading(false);
                    setIsAuthSuccessfull(false);
					return {
						status: SERVER_RESPONSES.INTERNAL_SERVER_ERROR,
						errorMessage: json["message"],
					};
			}
		} catch (error) {
			console.error(error);
			setIsLoading(false);
            setIsAuthSuccessfull(false);
			return {
				status: FETCH_STATUS.FETCH_FAIL,
				errorMessage: `Could not sign in due to ${error.message}`,
			};
		}
	};

	return {
		handleAuth,
		isLoading,
		isAuthSuccessfull,
		validationErrors,
	};
};
