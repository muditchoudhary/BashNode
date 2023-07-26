import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";

import "./index.css";

import UserAuthentication from "./layout/UserAuthentication";
import SignUpForm from "./Components/SignUpForm";
import SignInForm from "./Components/SignInForm";
import publishArticleImg from "./assets/images/publish-article.svg";

import RootLayout from "./layout/RootLayout";
import Draft from "./pages/Draft";

//CONSTANT VARIABLES
const FOOTER_TEXT = {
	signUp: "Sign In to your existing account",
	signIn: "Sign Up to create a new account",
};
const LINK_TO = { signUp: "/auth/sign-in", signIn: "/auth/sign-up" };

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<RootLayout />}>
			<Route index element={<h1>Home Page</h1>} />
			<Route
				path="auth"
				element={
					<UserAuthentication
						footerText={FOOTER_TEXT}
						linkTo={LINK_TO}
						img={publishArticleImg}
					/>
				}
				errorElement={<h2>error from auth</h2>}
			>
				<Route path="sign-up" element={<SignUpForm />} />
				<Route path="sign-in" element={<SignInForm />} />
			</Route>
			<Route path="draft" element={<Draft />} />
		</Route>
	)
);

export const App = () => {
	return <RouterProvider router={router} />;
};
