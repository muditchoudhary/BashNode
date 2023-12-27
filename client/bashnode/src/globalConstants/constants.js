export const SERVER_RESPONSES = {
	OK: 200,
	VALIDATION_CONFLICT: 409,
	INTERNAL_SERVER_ERROR: 500,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
};

export const FETCH_STATUS = {
	FETCH_FAIL: -1,
};

export const menuItemsWhenLogIN = [
	{
		label: "My Account",
		key: "my-account",
	},
	{
		type: "divider",
	},
	{
		label: "Log out",
		key: "log-out",
	},
];

export const menuItemsWhenLogOut = [
	{
		label: "Sign Up",
		key: "sign-up",
	},
	{
		type: "divider",
	},
	{
		label: "Sign In",
		key: "sign-in",
	},
];

export const BACKEND_URL = "https://bashnode.onrender.com/";
