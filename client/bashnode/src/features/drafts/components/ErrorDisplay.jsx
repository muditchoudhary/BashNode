import PropTypes from "prop-types";
import { Alert, Space } from "antd";

export const ErrorDisplay = ({ errorMap, onClose }) => {
	const fieldName = Object.keys(errorMap)[0];
	const errorType = errorMap[fieldName].type;
	const errorMessage = `${
		fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
	} ${errorMap[fieldName].message}`;

	return (
		<Space className="flex justify-center items-center w-full">
			<Alert
				message={errorType}
				description={errorMessage}
				type="error"
				showIcon
				closable
				afterClose={onClose}
			/>
		</Space>
	);
};

ErrorDisplay.propTypes = {
	errorMap: PropTypes.object.isRequired,
	onClose: PropTypes.func.isRequired,
};
