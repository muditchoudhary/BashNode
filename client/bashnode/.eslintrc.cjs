/*global module*/
module.exports = {
	env: { browser: true, es2020: true },
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:react/jsx-runtime",
		"plugin:react-hooks/recommended",
		"plugin:jest-dom/recommended",
	],
	parserOptions: { ecmaVersion: "latest", sourceType: "module" },
	settings: { react: { version: "18.2" } },
	plugins: ["react-refresh", "jest-dom"],
	rules: {
		"react-refresh/only-export-components": "warn",
		"jest-dom/prefer-checked": "error",
		"jest-dom/prefer-enabled-disabled": "error",
		"jest-dom/prefer-required": "error",
		"jest-dom/prefer-to-have-attribute": "error",
	},
};
