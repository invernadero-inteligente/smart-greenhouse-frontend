/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,jsx}"],
	theme: {
		extend: {
			colors: {
				moss: {
					100: "#e9f5e6",
					300: "#9fd69b",
					600: "#2f7f3c",
					800: "#1b4f2f"
				},
				soil: {
					100: "#f5efe8",
					500: "#9f6b3d",
					700: "#754825"
				}
			},
			fontFamily: {
				heading: ["Space Grotesk", "sans-serif"],
				body: ["Manrope", "sans-serif"]
			},
			boxShadow: {
				soft: "0 18px 60px rgba(27, 79, 47, 0.18)"
			}
		}
	},
	plugins: []
};
