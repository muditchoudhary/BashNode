import { SERVER_RESPONSES } from "../globalConstants/constants";

export const handleResponse = (json, status) => {
	if (
		json.success === false &&
		status === SERVER_RESPONSES.VALIDATION_CONFLICT
	) {
		const validationErrorMsgFromServer =
			json.validationErrors[Object.keys(json.validationErrors)[0]]["msg"];
		return {
			status,
			message: validationErrorMsgFromServer,
		};
	} else if (
		(json.success === false &&
			status === SERVER_RESPONSES.INTERNAL_SERVER_ERROR) ||
		status === SERVER_RESPONSES.BAD_REQUEST
	) {
		return {
			status,
			message: json["message"],
		};
	} else if (status == SERVER_RESPONSES.UNAUTHORIZED) {
		return {
			status,
		};
	} else if (json.success === true && status === SERVER_RESPONSES.OK) {
		return {
			status,
			successMessage: json["message"],
		};
	}
};

export const makeRequest = async (
	url,
	body,
	method,
	setIsActionLoading,
	user
) => {
	let response;
	let json;
	let status;
	let error;

	try {
		setIsActionLoading(true);

		response = await fetch(url, {
			method: method,
			mode: "cors",
			credentials: "include",
			headers: {
				Authorization: `Bearer ${user}`,
			},
			body: body,
		});

		json =
			response.status === SERVER_RESPONSES.UNAUTHORIZED
				? {}
				: await response.json();
		status = response.status;
	} catch (e) {
		error = e;
	}

	setIsActionLoading(false);
	return { json, status, error };
};
