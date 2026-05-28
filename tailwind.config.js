/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,jsx}"],
	darkMode: false,
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
				// Remap built-in Tailwind emerald/lime palettes to our CSS variables
				emerald: {
					50: 'var(--primary-50, #eaf6f3)',
					100: 'var(--primary-100, #d1efe9)',
					200: 'var(--primary-200, #a6e2d8)',
					300: 'var(--primary-300, #7acdbf)',
					400: 'var(--primary-400, #4fbda8)',
					500: 'var(--primary, #0E544B)',
					600: 'var(--primary-600, #0b4139)',
					700: 'var(--primary-700, #08352d)',
					900: 'var(--primary-900, #05221b)'
				},
				lime: {
					50: 'var(--primary-50, #eaf6f3)',
					100: 'var(--primary-100, #d1efe9)',
					200: 'var(--primary-200, #a6e2d8)',
					300: 'var(--primary-300, #7acdbf)',
					400: 'var(--primary-400, #4fbda8)',
					500: 'var(--primary, #0E544B)',
					600: 'var(--primary-600, #0b4139)',
					700: 'var(--primary-700, #08352d)',
					900: 'var(--primary-900, #05221b)'
				},
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
