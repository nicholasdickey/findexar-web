/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.{js,ts,jsx,tsx,mdx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    extend: {
      tabitem: {
        styles:{
          default:{
            active:{
              on: "bg-gray-100 text-green-600 dark:bg-gray-800 dark:text-green-500",
              off: "text-gray-500 hover:bg-gray-50 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800  dark:hover:text-gray-300"
            }
          }
        }
      }
    },
  },
  plugins: [ require('flowbite/plugin'),],
}

