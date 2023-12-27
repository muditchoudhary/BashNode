import { useAuthContext } from "../../../hooks/useAuthContext";

export const useLogout = () => {
	const { dispatch } = useAuthContext();

	const logOut = () => {
		localStorage.removeItem("user");
		dispatch({ type: "LOGOUT", payload: false });
	};

	return { logOut };
};
