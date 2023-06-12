import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import ssr from "vite-plugin-ssr/plugin";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), ssr()],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./setupTests.js",
	},
	server: {
		proxy: {
			"/": "http://localhost:3000/",
		},
	},
});
