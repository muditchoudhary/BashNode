import { useState } from "react";

export const useAlert = () => {
    const [message, setMessage] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");

	const closeAlert = (setServerErrors) => {
		const alertElementContainer = document.querySelector(".alert-box");
		const alertElement = alertElementContainer.querySelector(".ant-alert");
		const alertCloseIcon = alertElement.querySelector(
			".ant-alert-close-icon"
		);
		if (alertCloseIcon) {
			alertCloseIcon.click();
            setServerErrors(null);
           
		}
	};

	return { message, description, type, setMessage, setDescription, setType, closeAlert };
};
