import { createContext, useReducer, useEffect } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext();

const authReducer = (state, action) => {
	switch (action.type) {
		case "LOGIN":
			return { user: action.payload };
		case "LOGOUT":
			return { user: action.payload };
		case "NOT_FOUND": {
			return { user: action.payload };
		}
		default:
			return state;
	}
};

export const AuthContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, {
		user: null,
	});

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("user"));

		if (user === null) {
			dispatch({ type: "NOT_FOUND", payload: false });
		}
		if (user) {
			dispatch({ type: "LOGIN", payload: user });
		}
	}, []);

	// console.log("AuthContext state:", state);

	return (
		<AuthContext.Provider value={{ ...state, dispatch }}>
			{children}
		</AuthContext.Provider>
	);
};
AuthContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
