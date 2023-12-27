import { toast } from "react-toastify";
import {
	SERVER_RESPONSES,
	FETCH_STATUS,
} from "../../../globalConstants/constants";

//  This function handles the response from a server request.
//  Depending on the status of the response, it will display a toast notification with an appropriate message.
export const handleResponse = (response) => {
	switch (response.status) {
		case FETCH_STATUS.FETCH_FAIL:
		case SERVER_RESPONSES.VALIDATION_CONFLICT:
		case SERVER_RESPONSES.INTERNAL_SERVER_ERROR:
		case SERVER_RESPONSES.BAD_REQUEST:
			toast.error(response.message);
			break;
		case SERVER_RESPONSES.OK:
			toast.success(response.successMessage);
			break;
		default:
			toast.error("Unknown error occurred");
	}
};
