import {
	Routes,
	Route,
	BrowserRouter,
	useLocation,
	Navigate,
	Outlet,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { RootLayout } from "./layout/RootLayout";
import { HomeLayout } from "./features/home/layout/HomeLayout";
import { AuthLayout } from "./features/authenticaton/layouts/AuthLayout";
import { DraftLayout } from "./features/drafts/layouts/DraftLayout";
import { SignIn } from "./features/authenticaton/components/SignIn";
import { SignUp } from "./features/authenticaton/components/SignUp";
import { useAuthContext } from "./hooks/useAuthContext";
import { DraftEditor } from "./features/drafts/components/DraftEditor";
import { PublishEditor } from "./features/drafts/components/PublishEditor";
import { BlogLayout } from "./features/blog/layouts/BlogLayout";
import { BlogPreview } from "./features/drafts/components/BlogPreview";
import { UserDashboarLayout } from "./features/dashboard/layouts/UserDashboardLayout";

import "./index.css";
import "antd/dist/reset.css";

/* 
The component checks if a user is authenticated. If the user is authenticated, it renders the component's children (protected routes). If not, it redirects the user to the sign-in page.
*/
const AuthGuard = () => {
	const { user } = useAuthContext();
	const location = useLocation();

	if (user === null) return "loading...";

	if (user) {
		return <Outlet />;
	} else {
		return <Navigate to="/sign-in" state={{ from: location }} replace />;
	}
};

/* 
 The component checks if a user is authenticated and, if so, redirects them to the from route. If the user is not authenticated, it renders the component's children (routes for sign-up and sign-in).
 */
const AuthRedirect = () => {
	const { user } = useAuthContext();
	const location = useLocation();
	const from = location?.state?.from?.pathname || "/";

	if (user === null) return "loading...";

	if (user) {
		return (
			<Navigate
				to={from}
				state={{
					alertState: {
						alertMessage: "",
						alertDescription: "You are already signed in",
						alertType: "warning",
					},
				}}
				replace
			/>
		);
	} else {
		return <Outlet />;
	}
};

export const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<RootLayout />}>
					<Route index element={<HomeLayout />} />
					<Route element={<AuthRedirect />}>
						<Route element={<AuthLayout />}>
							<Route path="/sign-up" element={<SignUp />} />
							<Route path="/sign-in" element={<SignIn />} />
						</Route>
					</Route>

					<Route element={<AuthGuard />}>
						<Route element={<DraftLayout />}>
							<Route path="/drafts">
								<Route
									path=":draftId"
									element={<DraftEditor />}
								/>
							</Route>
							<Route path="/edit">
								<Route
									path=":publishedBlogId"
									element={<PublishEditor />}
								/>
							</Route>
							<Route path="/preview">
								<Route
									path=":blogId"
									element={<BlogPreview />}
								/>
							</Route>
						</Route>
						<Route
							path="/dashboard"
							element={<UserDashboarLayout />}
						/>
					</Route>
					<Route path="/blog">
						<Route path=":blogId" element={<BlogLayout />} />
					</Route>
				</Route>
                <Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
			<ToastContainer />
		</BrowserRouter>
	);
};
