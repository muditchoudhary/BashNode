/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"electric-blue": "#2463EA",
				"midnight-slate": "#2E353A",
				"silver-gray": "#BEC1C3",
			},
			flex: {
				"3": "3 3 0%",
                "2": "2 2 0%",
			},
            screens: {
                "desktop": "1440px"
            }
		},
	},
	plugins: [],
};
