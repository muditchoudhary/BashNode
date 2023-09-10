import { Outlet, useLocation } from "react-router-dom";
import { ConfigProvider } from "antd";
import { useMediaQuery } from "react-responsive";

import { AlertBox } from "../../../components/AlertBox";
import { useSignUp } from "../hooks/useSignUp";
import { useSignIn } from "../hooks/useSignIn";
import { useAlert } from "../../../hooks/useAlert";

import publishArticleImg from "../../../assets/images/publish-article.svg";

export const AuthLayout = () => {
	const isScreen2xl = useMediaQuery({
		query: "(min-width: 1536px)",
	});
	const { pathname } = useLocation();

	const {
		message,
		description,
		type,
		setMessage,
		setDescription,
		setType,
		closeAlert,
	} = useAlert();

	// Takes alertState's states setter function so that the Alert component can be rendered when there are server errors.
	const signUpState = useSignUp(setMessage, setDescription, setType);
	const signInState = useSignIn(setMessage, setDescription, setType);

	// Assign state based on the pathname.
	const authenticationState =
		pathname === "/sign-in" ? signInState : signUpState;

	const {
		handleAuth,
		isLoading,
		serverErrors,
		validationErrors,
		isAuthSuccessfull,
	} = authenticationState;

	return (
		<>
			<div className="auth-layout-container flex">
				{authenticationState.serverErrors && (
					// If there are server errors (like backend server not working, client internet not working, db error etc), render the AlertBox component.
					<AlertBox
						message={message}
						description={description}
						type={type}
						closeAlert={() => {
							closeAlert(authenticationState.setServerErrors);
						}}
					/>
				)}
				<div className="auth-container flex flex-col flex-1 lg:flex-1 ">
					<p className="text-electric-blue text-4xl font-bold justify-self-center self-center flex items-center flex-1 py-3 2xl:text-6xl m-0 ">
						BashNode
					</p>
					<ConfigProvider
						theme={{
							components: {
								Button: {
									fontSize: isScreen2xl ? 30 : 20,
									controlHeight: isScreen2xl ? 58 : 38,
								},
								Divider: {
									colorSplit: "#757575",
									fontSize: isScreen2xl ? 30 : 20,
								},
							},
						}}
					>
						<Outlet
							context={{
								handleAuth,
								isLoading,
								serverErrors,
								validationErrors,
								isAuthSuccessfull,
							}}
						/>
					</ConfigProvider>
				</div>
				<div className="app-presentation-container hidden lg:flex lg:flex-col lg:flex-2">
					<div className="tagline-container flex flex-col items-center font-black text-xl flex-1 justify-center py-5 2xl:text-3xl ">
						<p>&quot;Unleash Your Words, Inspire The World&quot;</p>
						<p>With</p>
						<p className=" text-electric-blue text">BashNode</p>
					</div>
					<img
						src={publishArticleImg}
						alt="A girl publishing an article"
						className=" w-2/3 h-auto self-center flex-2"
					/>
				</div>
			</div>
		</>
	);
};
