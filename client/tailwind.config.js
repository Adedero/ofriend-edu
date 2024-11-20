/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#001938",
        "primary-50": "#73A4E2",
        "primary-100": "#468FEC",
        "primary-200": "#104E9E",
        "primary-300": "#00377D",
        "primary-400": "#002554",
        "primary-500": "#001938",
        "primary-600": "#001024",
        "primary-700": "#020E1D",
        "primary-800": "#000914",
        "primary-900": "#00050A",
        "primary-950": "#000000",

        "surface": "#4D5A6B",
        "surface-50": "#ACB6C3",
        "surface-100": "#A0ACBB",
        "surface-200": "#8997AA",
        "surface-300": "#718299",
        "surface-400": "#5E6E83",
        "surface-500": "#4D5A6B",
        "surface-600": "#363F4A",
        "surface-700": "#1E232A",
        "surface-800": "#070809",
        "surface-900": "#000000",

        "turquoise": "#11CBF4",
        "turquoise- 50": "#C0F1FC",
        "turquoise-100": "#ADEDFB",
        "turquoise-200": "#86E5F9",
        "turquoise-300": "#5FDCF8",
        "turquoise-400": "#38D4F6",
        "turquoise-500": "#11CBF4",
        "turquoise-600": "#09A2C4",
        "turquoise-700": "#07768E",
        "turquoise-800": "#044959",
        "turquoise-900": "#021D23",
        "turquoise-950": "#000708",

        "lily": "#E7FAFE",
        "lily-50": "#FFFFFF",
        "lily-100": "#FFFFFF",
        "lily-200": "#FFFFFF",
        "lily-300": "#FFFFFF",
        "lily-400": "#FFFFFF",
        "lily-500": "#E7FAFE",
        "lily-600": "#B1EFFC",
        "lily-700": "#7BE4FA",
        "lily-800": "#45D8F7",
        "lily-900": "#10CDF5",
        "lily-950": "#09BADF",

        "default-dark": "#222222",
        "default-light": "#908D8D",
      },
      screens: {
        "ss": "800px",
      }
    },
  },
  plugins: [],
}

