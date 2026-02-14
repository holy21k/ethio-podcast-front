/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'cosmic-bg-start': '#3b0a63',
                'cosmic-bg-end': '#0b0215',
                'cosmic-accent-1': '#9d4edd',
                'cosmic-accent-2': '#c77dff',
                'cosmic-accent-3': '#5a189a',
                'cosmic-card': '#1b0c2d', // or #1a0729
                'cosmic-card-hover': '#2d1b4e',
            },
            backgroundImage: {
                'cosmic-gradient': 'radial-gradient(circle at top, #3b0a63, #0b0215)',
            }
        },
    },
    plugins: [],
}
