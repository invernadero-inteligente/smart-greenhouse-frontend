/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,jsx}"],
	theme: {
		extend: {
			colors: {
				background: 'var(--bg)',
				foreground: 'var(--fg)',
				card: 'var(--card)',
				'card-muted': 'var(--card-muted)',
				muted: 'var(--muted)', // verde
				accent: 'var(--accent)', // verde
				primary: 'var(--primary)', // verde
				secondary: 'var(--secondary)', // dorado
				gold: '#d4af37',
				destructive: 'var(--destructive)',
				border: 'var(--border)',
				input: 'var(--input-bg)',
				ring: 'var(--ring)'
			},
			fontFamily: {
				sans: ["Inter", "Geist", "ui-sans-serif", "system-ui", "sans-serif"],
				heading: ["Inter", "Geist", "ui-sans-serif", "system-ui", "sans-serif"],
				body: ["Inter", "Geist", "ui-sans-serif", "system-ui", "sans-serif"]
			},
			boxShadow: {
				soft: "0 18px 60px rgba(0, 0, 0, 0.35)"
			}
		}
	},
	plugins: []
};
