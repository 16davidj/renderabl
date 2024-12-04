"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const GolfPlayerCard = ({ name, height, birthday, age, rank, tour, alma_mater, hometown, recent_win, profilePictureUrl, sponsor, clubs, ball }) => {
    const getTourLogo = (tour) => {
        switch (tour) {
            case "LIV": return "https://i.pinimg.com/originals/3c/64/8c/3c648c9fb9821071b78a3e171f085961.png";
            case "PGA": return "https://upload.wikimedia.org/wikipedia/en/thumb/7/77/PGA_Tour_logo.svg/1200px-PGA_Tour_logo.svg.png";
            case "DP": return "https://sportspro.com/wp-content/uploads/2023/03/DP-World-Tour-Logo.png";
            case "LPGA": return "https://cdn.cookielaw.org/logos/9c8a7e84-2713-496b-bb8b-4ab1c7aa9853/01917b66-958c-71d8-80e3-efefcbc9cdc9/9ed04020-943b-462b-ac02-b19496f9ce72/BRD23_LOGO_-_FLAT_RGB_VERT_(1).png";
            case "Champions": return "https://upload.wikimedia.org/wikipedia/en/thumb/f/fe/PGA_Tour_Champions_logo.svg/640px-PGA_Tour_Champions_logo.svg.png";
        }
        return null;
    };
    const getSponsorLogo = (sponsor) => {
        switch (sponsor) {
            case "TaylorMade": return "https://upload.wikimedia.org/wikipedia/commons/a/a0/TaylorMade.svg";
            case "Titleist": return "https://upload.wikimedia.org/wikipedia/commons/d/d6/Titleist_golf_logo.png";
            case "Callaway": return "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Callaway_Golf_Company_logo.svg/2560px-Callaway_Golf_Company_logo.svg.png";
            case "Ping": return "https://upload.wikimedia.org/wikipedia/commons/3/37/Ping-logo.png";
            case "Mizuno": return "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/MIZUNO_logo.svg/2560px-MIZUNO_logo.svg.png";
            case "Srixon": return "https://upload.wikimedia.org/wikipedia/commons/f/f5/Srixon_golf_logo.PNG";
            case "Wilson": return "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Wilson-logo.svg/1024px-Wilson-logo.svg.png";
            case "PXG": return "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/PXG_Logo.svg/1280px-PXG_Logo.svg.png";
        }
        return null;
    };
    const tourLogo = getTourLogo(tour);
    const sponsorLogo = getSponsorLogo(sponsor);
    console.log(sponsorLogo);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200", children: [profilePictureUrl && ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-64 bg-gray-100 overflow-hidden", children: (0, jsx_runtime_1.jsx)("img", { src: profilePictureUrl, alt: `${name} profile`, className: "w-full h-full object-cover" }) })), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-100 p-4 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [tourLogo && ((0, jsx_runtime_1.jsx)("img", { src: tourLogo, alt: "Tour Logo", className: "h-8 w-8 mr-2 object-contain" })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-semibold", children: name }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: ["Rank: ", rank] })] })] }), sponsorLogo && ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("img", { src: sponsorLogo, alt: `${sponsor} Logo`, className: "h-8 w-16 object-contain" }) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600 mb-2", children: (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Born:" }), " ", birthday, " (", age, " years old)"] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Hometown:" }), " ", hometown] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Height:" }), " ", height] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Alma Mater:" }), " ", alma_mater] }), recent_win && ((0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Recent Win:" }), " ", recent_win] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-semibold", children: "Ball Used:" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-700", children: ball })] }), clubs && clubs.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-semibold", children: "Clubs:" }), (0, jsx_runtime_1.jsx)("ul", { className: "list-disc list-inside text-sm text-gray-700", children: clubs.map((club, index) => ((0, jsx_runtime_1.jsx)("li", { children: club }, index))) })] }))] })] }));
};
exports.default = GolfPlayerCard;
//# sourceMappingURL=golfcard.js.map