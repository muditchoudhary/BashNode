import { useLocation } from "react-router-dom";

import { AlertBox } from "../components/AlertBox";
import { useAlert } from "../hooks/useAlert";

export const HomePage = () => {
	const { closeAlert } = useAlert();
	const location = useLocation();

	console.log(location);

	return (
		<>
			<div className="home-layout-container">
				{location.state !== null && (
					<AlertBox
						message={location.state.alertState.alertMessage}
						description={location.state.alertState.alertDescription}
						type={location.state.alertState.alertType}
						closeAlert={() => {
							closeAlert();
						}}
					/>
				)}
				<h1>This is the home page</h1>
			</div>
		</>
	);
};
