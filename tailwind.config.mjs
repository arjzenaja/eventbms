/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
		container: {
			center: "true",
			padding: "15px",
		},
		screens: {
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1310px",
		},
		fontFamily: {
			primary: "var(--font-poppins)",
			secondary: "var(--font-caveat)",
		},
  	extend: {
			colors: {
				primary: "#0f1017",
				accent: {
					DEFAULT: "#10B981",
					hover: "#059669",
				},
				secondary: {
					DEFAULT: "#1b1c23",
					hover: "#1f212d",
				},
				tertiary: {
					DEFAULT: "#26272e",
					hover: "#24252c",
				},
				grey: "#737373",
			},
			backgroundImage: {
			hero_bg1: "url('/hero/menara teratai.jpg')",
			hero_bg2: "url('/hero/caub.jpg')",
			pattern: "url('/pattern_bg.png')", // ← gunakan path ini
		}
		},
  },
  plugins: [require("tailwindcss-animate")],
};
