/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,tsx}"],
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