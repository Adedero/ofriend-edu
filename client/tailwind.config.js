/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  /*
  DEFAULT: '#001938',
  50: '#E0EEFF',
  100: '#BDDAFF',
  200: '#68AAFD',
  300: '#0059C7',
  400: '#00377A',
  500: '#00224D',
  600: '#00142E',
  700: '#000E1F',
  800: '#000914',
  900: '#00070F',
  950: '#000205' */
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        'primary': '#001938',
        'primary-50': '#E0EEFF',
        'primary-100': '#BDDAFF',
        'primary-200': '#68AAFD',
        'primary-300': '#0059C7',
        'primary-400': '#00377A',
        'primary-500': '#00224D',
        'primary-600': '#00142E',
        'primary-700': '#000E1F',
        'primary-800': '#000914',
        'primary-900': '#00070F',
        'primary-950': '#000205',

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

