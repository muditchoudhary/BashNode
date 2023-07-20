import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(null);
	const { dispacth } = useAuthContext();

	const signup = async (name, email, password) => {
		setIsLoading(true);
		setError(null);
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
					name,
					email,
					password,
				}),
			});
		} catch (error) {
			console.error(error);
		}

		const json = await response.json();

		if (response.status === 400) {
			setIsLoading(false);
			setError(json.errors);
		}

		if (response.status === 409) {
			setIsLoading(false);
			setError(json.errors);
		}

		if (response.status === 200) {
			localStorage.setItem("user", JSON.stringify(json));
			dispacth({ type: "LOGIN", payload: json });
			setIsLoading(false);
			setError(null);
			console.log(localStorage);
		}
	};

	return { signup, isLoading, error };
};
