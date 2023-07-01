import React from "react";
import ReactDOM from "react-dom/client";
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

//CONSTANT VARIABLES
const FOOTER_TEXT = {
	signUp: "Sign In to your existing account",
	signIn: "Sign Up to create a new account",
};
const LINK_TO = { signUp: "/auth/sign-in", signIn: "/auth/sign-up" };
const router = createBrowserRouter(
	createRoutesFromElements(
		<Route
			path="/auth"
			element={
				<UserAuthentication
					footerText={FOOTER_TEXT}
					linkTo={LINK_TO}
					img={publishArticleImg}
                    
				/>
			}
            errorElement={<p>hello error</p>}
		>
			<Route path="sign-up" element={<SignUpForm />}/>
			<Route path="sign-in" element={<SignInForm />}/>

		</Route>
	)
);


ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
