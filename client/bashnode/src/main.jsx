import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./error-page";
import { SignUp } from "./routes/sign-up";
import "./index.css";
import SignIn from "./routes/SignIn";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		errorElement: <ErrorPage />,
	},
	{
		path: "auth/sign-up",
		element: <SignUp />,
		errorElement: <ErrorPage />,
	},
	{
		path: "auth/sign-in",
		element: <SignIn />,
		errorElement: <ErrorPage />,
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
