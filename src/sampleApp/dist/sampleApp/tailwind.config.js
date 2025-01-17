/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            aspectRatio: {
                '16/9': '16 / 9',
            },
        },
    },
    plugins: [require('@tailwindcss/aspect-ratio')],
};
//# sourceMappingURL=tailwind.config.js.map