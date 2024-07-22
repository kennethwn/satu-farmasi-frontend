const { Nunito_Sans } = require("next/font/google");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Nunito_Sans: ["Nunito Sans", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
        "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        dark: '#333333',
        light: '#FFFFFF',
        success: '#79B12A',
        selected: '#659BB0',
        danger: '#DC4A43',
        warning: '#FFD400',
        hover: {
          light: '#EDF8FC',
          dark: '#3D5D6A',
        },
        background: {
          light: '#FAFAFA',
          danger: '#FEE9E8',
          sidebar: '#F4F5F7',
        },
        border: {
          primary: '#F1F1F1',
          box: '#DDDDDD'
        },
        button: {
          primary: '#2F4852',
          danger: '#FEE9E8',
        },
        checkbox: {
          primary: '#3598FF'
        }
      }
    },
  },
  plugins: [],
};
