import PropTypes from "prop-types";
import { Alert } from "antd";
import { useEffect } from "react";

export const AlertBox = ({ message, description, type, closeAlert }) => {
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			closeAlert();
		}, 3000);

		return () => {
			clearTimeout(timeoutId);
		};
	}, []);

	return (
		<div className="alert-box border-2 border-green-800 border-solid absolute">
			<Alert
				message={message}
				description={description}
				type={type}
				closable
				showIcon
                afterClose={closeAlert}
			/>
		</div>
	);
};
AlertBox.propTypes = {
	message: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	closeAlert: PropTypes.func.isRequired,
};
