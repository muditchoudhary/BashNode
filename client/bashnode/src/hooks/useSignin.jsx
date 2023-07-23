import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignin = () => {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(null);
	const { dispatch } = useAuthContext();

	const login = async (email, password) => {
		setIsLoading(true);
		setError(null);
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
		} catch (error) {
			console.error(error);
		}

		const json = await response.json();

		console.log(json);

		switch (response.status) {
			case 400:
				setIsLoading(false);
				setError(json.errors);
				break;
			case 500:
				console.error(json.message);
				setIsLoading(false);
				break;
			case 401:
				console.error(json.message);
				setIsLoading(false);
				break;
			case 200:
				localStorage.setItem("user", JSON.stringify(json));
				dispatch({ type: "LOGIN", payload: json });
				setIsLoading(false);
				break;
			default:
				break;
		}
	};

	return { login, isLoading, error };
};
