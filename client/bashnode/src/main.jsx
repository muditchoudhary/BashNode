import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";

import { App } from "./App";
import { AuthContextProvider } from "./context/AuthContext";
ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: "#2563eb",
					colorInfo: "#2563eb",
				},
			}}
		>
			<AuthContextProvider>
				<App />
			</AuthContextProvider>
		</ConfigProvider>
	</React.StrictMode>
);
