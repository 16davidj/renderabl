"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const GolfTournamentCard = ({ name, location, course, summary, dates, weather, purse, players, coursePictureUrl, ytHighlightsId, year, messages, setMessages }) => {
    const fetchGolfPlayer = (name, year) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fetch(`http://localhost:5500/api/openai`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: [{ role: 'user', content: name + " in " + year }] })
        });
        const responseMsg = JSON.parse(yield response.text());
        setMessages([...messages, responseMsg]);
    });
    const [hoveredIndex, setHoveredIndex] = (0, react_1.useState)(null);
    const handleMouseEnter = (index) => setHoveredIndex(index);
    const handleMouseLeave = () => setHoveredIndex(null);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "inline-block w-3/4 max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200", children: [coursePictureUrl && ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-68 bg-gray-100 overflow-hidden", children: (0, jsx_runtime_1.jsx)("img", { src: coursePictureUrl, alt: `${course} Course`, className: "w-full h-full object-cover" }) })), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-100 p-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-semibold", children: name + " " + "(" + year + ")" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: course })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Location:" }), " ", location] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Dates:" }), " ", dates] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Weather:" }), " ", weather] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Purse:" }), " $", purse.toLocaleString()] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Summary:" }), " ", summary.toLocaleString()] })] }), ytHighlightsId && ((0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-lg font-semibold mb-2", children: "Highlights" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative w-full aspect-w-16 aspect-h-9", children: [" ", (0, jsx_runtime_1.jsx)("iframe", { src: `https://www.youtube.com/embed/${ytHighlightsId}`, title: "YouTube video player", className: "w-full h-full", allowFullScreen: true })] })] })), players && players.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-lg font-semibold mb-2", children: "Leaderboard" }), (0, jsx_runtime_1.jsxs)("table", { className: "min-w-full bg-white border border-gray-300", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-gray-200", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "px-4 py-2 text-left", children: "Position" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-2 text-left", children: "Name" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-2 text-center", children: "R1" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-2 text-center", children: "R2" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-2 text-center", children: "R3" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-2 text-center", children: "R4" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-2 text-center", children: "Final" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-2 text-right", children: "Prize Money" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: players.map((player, index) => {
                                    return ((0, jsx_runtime_1.jsxs)("tr", { className: `border-t ${index % 2 === 0 ? "bg-gray-100" : ""}`, children: [(0, jsx_runtime_1.jsx)("td", { className: "px-4 py-2 text-left", children: player.position }), (0, jsx_runtime_1.jsx)("td", { onClick: () => { fetchGolfPlayer(player.name, year); }, onMouseEnter: () => handleMouseEnter(index), onMouseLeave: handleMouseLeave, style: { cursor: 'pointer', textDecoration: hoveredIndex === index ? 'underline' : 'none', }, className: "px-4 py-2 text-left", children: player.name }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-2 text-center", children: player.roundScores[0] }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-2 text-center", children: player.roundScores[1] }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-2 text-center", children: player.roundScores[2] }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-2 text-center", children: player.roundScores[3] }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-2 text-center", children: player.finalScore }), (0, jsx_runtime_1.jsxs)("td", { className: "px-4 py-2 text-right", children: ["$", player.prizeMoney.toLocaleString()] })] }, index));
                                }) })] })] }))] }));
};
exports.default = GolfTournamentCard;
//# sourceMappingURL=golftournamentcard.js.map