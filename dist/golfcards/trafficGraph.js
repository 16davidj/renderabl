"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const TrafficAgentCard = ({ traffic_qps }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-gray-100 p-4", children: (0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-semibold", children: "Traffic Monitoring" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-semibold", children: "Queries Per Second (QPS):" }), (0, jsx_runtime_1.jsx)("ul", { className: "list-disc list-inside text-sm text-gray-700", children: traffic_qps.map((qps, index) => ((0, jsx_runtime_1.jsxs)("li", { children: ["Interval ", index + 1, ": ", qps, " QPS"] }, index))) })] })] }));
};
exports.default = TrafficAgentCard;
//# sourceMappingURL=trafficGraph.js.map