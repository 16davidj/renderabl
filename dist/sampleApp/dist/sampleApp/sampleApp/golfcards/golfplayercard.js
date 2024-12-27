"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const GolfPlayerCard = ({ name, year, height, birthday, rank, tourLogoUrl, almaMater, hometown, recentWin, firstWin, profilePictureUrl, sponsorLogoUrl, clubs, ball, messages, setMessages }) => {
    const fetchWin = (win) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fetch(`http://localhost:5500/api/renderabl`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: [{ role: 'user', content: win }] })
        });
        const responseMsg = JSON.parse(yield response.text());
        setMessages([...messages, responseMsg]);
    });
    const [isFirstWinHovered, setFirstWinIsHovered] = (0, react_1.useState)(false);
    const [isRecentWinHovered, setRecentWinIsHovered] = (0, react_1.useState)(false);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200", children: [profilePictureUrl && ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-64 bg-gray-100 overflow-hidden", children: (0, jsx_runtime_1.jsx)("img", { src: profilePictureUrl, alt: `${name} profile`, className: "w-full h-full object-cover" }) })), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-100 p-4 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [tourLogoUrl && ((0, jsx_runtime_1.jsx)("img", { src: tourLogoUrl, alt: "Tour Logo", className: "h-8 w-8 mr-2 object-contain" })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-semibold", children: year ? name + " (" + year + ")" : name }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: ["Rank: ", rank] })] })] }), sponsorLogoUrl && ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("img", { src: sponsorLogoUrl, alt: `Sponsor Logo`, className: "h-8 w-16 object-contain" }) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600 mb-2", children: (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Born:" }), " ", birthday] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Hometown:" }), " ", hometown] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Height:" }), " ", height] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Alma Mater:" }), " ", almaMater] }), firstWin && ((0, jsx_runtime_1.jsxs)("p", { onClick: () => fetchWin(firstWin), onMouseEnter: () => setFirstWinIsHovered(true), onMouseLeave: () => setFirstWinIsHovered(false), style: { cursor: 'pointer', textDecoration: isFirstWinHovered ? 'underline' : 'none' }, children: [(0, jsx_runtime_1.jsx)("strong", { children: "First Win:" }), " ", firstWin] })), recentWin && ((0, jsx_runtime_1.jsxs)("p", { onClick: () => fetchWin(recentWin), onMouseEnter: () => setRecentWinIsHovered(true), onMouseLeave: () => setRecentWinIsHovered(false), style: { cursor: 'pointer', textDecoration: isRecentWinHovered ? 'underline' : 'none' }, children: [(0, jsx_runtime_1.jsx)("strong", { children: "Recent Win:" }), " ", recentWin] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-semibold", children: "Ball Used:" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-700", children: ball })] }), clubs && clubs.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-semibold", children: "Clubs:" }), (0, jsx_runtime_1.jsx)("ul", { className: "list-disc list-inside text-sm text-gray-700", children: clubs.map((club, index) => ((0, jsx_runtime_1.jsx)("li", { children: club }, index))) })] }))] })] }));
};
exports.default = GolfPlayerCard;
//# sourceMappingURL=golfplayercard.js.map