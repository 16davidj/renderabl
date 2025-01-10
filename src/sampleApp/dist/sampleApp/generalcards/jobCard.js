"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("../app.css"); // Import CSS file for styling
const JobRunCard = ({ jobs }) => {
    if (jobs.length > 0) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "job-run-card-container", children: jobs.map((job, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "job-run-card", children: [(0, jsx_runtime_1.jsx)("h3", { className: "job-name", children: job.name }), (0, jsx_runtime_1.jsxs)("p", { className: "job-detail", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Cell:" }), " ", job.cell] }), (0, jsx_runtime_1.jsxs)("p", { className: "job-detail", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Created At:" }), " ", new Date(job.createdAt).toLocaleString()] }), (0, jsx_runtime_1.jsxs)("p", { className: "job-detail", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Duration:" }), " ", job.durationMin, " minutes"] }), (0, jsx_runtime_1.jsxs)("p", { className: "job-detail", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Succeeded:" }), " ", job.success ? 'Yes' : 'No'] }), (0, jsx_runtime_1.jsxs)("p", { className: "job-detail", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Resource Usage:" }), " ", job.resourceUsage] })] }, job.id))) }));
    }
    return null; // Return null if no jobs
};
exports.default = JobRunCard;
//# sourceMappingURL=jobCard.js.map