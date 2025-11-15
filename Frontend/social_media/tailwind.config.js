/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				// Dark mode
				dark: {
					bg: "#0A0E27",
					surface: "#1A1F3A",
					card: "#151D3B",
					border: "#2D3748",
				},
				// Light mode
				light: {
					bg: "#FFFFFF",
					surface: "#F9FAFB",
					card: "#FFFFFF",
					border: "#E5E7EB",
				},
				// Brand colors
				brand: {
					primary: "#7C3AED",
					"primary-hover": "#9F67FF",
					accent: "#06B6D4",
					success: "#10B981",
					warning: "#F59E0B",
					glow: "rgba(124, 58, 237, 0.3)",
				},
			},
			animation: {
				shimmer: "shimmer 2s infinite",
				"pulse-glow": "pulse-glow 2s ease-in-out infinite",
				"heart-bounce": "heart-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
				"slide-up": "slide-up 0.3s ease-out",
				"fade-in": "fade-in 0.3s ease-out",
				"scale-in": "scale-in 0.3s ease-out",
			},
			keyframes: {
				shimmer: {
					"0%": { backgroundPosition: "-1000px 0" },
					"100%": { backgroundPosition: "1000px 0" },
				},
				"pulse-glow": {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.7" },
				},
				"heart-bounce": {
					"0%": { transform: "scale(1)" },
					"50%": { transform: "scale(1.2)" },
					"100%": { transform: "scale(1)" },
				},
				"slide-up": {
					from: { transform: "translateY(10px)", opacity: "0" },
					to: { transform: "translateY(0)", opacity: "1" },
				},
				"fade-in": {
					from: { opacity: "0" },
					to: { opacity: "1" },
				},
				"scale-in": {
					from: { transform: "scale(0.95)", opacity: "0" },
					to: { transform: "scale(1)", opacity: "1" },
				},
			},
			backdropFilter: {
				glass: "blur(10px)",
			},
			boxShadow: {
				glow: "0 0 20px rgba(124, 58, 237, 0.4)",
				"glow-lg": "0 0 40px rgba(124, 58, 237, 0.6)",
				glass: "0 8px 32px rgba(0, 0, 0, 0.1)",
			},
			borderRadius: {
				brand: "12px",
			},
		},
	},
	plugins: [],
};