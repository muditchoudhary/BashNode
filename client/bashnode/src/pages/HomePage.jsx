import { useLocation } from "react-router-dom";

import { AlertBox } from "../components/AlertBox";

export const HomePage = () => {
	const location = useLocation();

	// Extract alertState from location state, or default to null if not available
	const alertState = location.state?.alertState || null;

	return (
		<>
			<div className="home-layout-container">
				{alertState && (
					// Render AlertBox component if alertState is available
					<AlertBox
						message={location.state.alertState.alertMessage}
						description={location.state.alertState.alertDescription}
						type={location.state.alertState.alertType}
						closeAlert={() => {
							window.history.replaceState(null, "");
						}}
					/>
				)}
				<h1>This is the home page</h1>
			</div>
		</>
	);
};
