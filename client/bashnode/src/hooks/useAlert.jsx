import { useState } from "react";

export const useAlert = () => {
	const [message, setMessage] = useState("");
	const [description, setDescription] = useState("");
	const [type, setType] = useState("");

	const closeAlert = (setServerErrors) => {
		const alertElementContainer = document.querySelector(".alert-box");
		const alertElement = alertElementContainer.querySelector(".ant-alert");

		if (alertElement) {
			const alertCloseIcon = alertElement.querySelector(
				".ant-alert-close-icon"
			);
			alertCloseIcon.click();
		} else {
			alertElementContainer.remove();
		}
		setServerErrors ? setServerErrors(null) : null;
	};

	return {
		message,
		description,
		type,
		setMessage,
		setDescription,
		setType,
		closeAlert,
	};
};
