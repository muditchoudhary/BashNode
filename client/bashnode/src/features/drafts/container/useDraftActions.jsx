import { useState } from "react";

export const useDraftActions = () => {
	const [isAlertVisible, setIsAlertVisible] = useState(false);

	const hideAlert = () => setIsAlertVisible(false);
	const showAlert = () => setIsAlertVisible(true);

	return { showAlert, hideAlert, isAlertVisible };
};
