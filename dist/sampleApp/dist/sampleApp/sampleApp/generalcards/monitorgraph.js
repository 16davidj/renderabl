"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_chartjs_2_1 = require("react-chartjs-2");
const chart_js_1 = require("chart.js");
const date_fns_1 = require("date-fns");
// Register chart.js components
chart_js_1.Chart.register(chart_js_1.CategoryScale, chart_js_1.LinearScale, chart_js_1.PointElement, chart_js_1.LineElement, chart_js_1.Title, chart_js_1.Tooltip, chart_js_1.Legend);
const MonitoringGraph = ({ handlerName, inputData }) => {
    // Prepare the data for the chart
    const chartData = {
        labels: inputData.map((dataPoint) => (0, date_fns_1.format)(new Date(dataPoint.timestamp), "yyyy-MM-dd HH:mm:ss")), // Convert timestamps to human-readable date/time
        datasets: [
            {
                label: "QPS (Queries per Second)",
                data: inputData.map((dataPoint) => dataPoint.qps),
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderWidth: 2,
            },
        ],
    };
    // Chart options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: handlerName,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Time",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "QPS",
                },
                beginAtZero: true,
            },
        },
    };
    return ((0, jsx_runtime_1.jsx)("div", { style: { width: "80%", margin: "0 auto" }, children: (0, jsx_runtime_1.jsx)(react_chartjs_2_1.Line, { data: chartData, options: options }) }));
};
exports.default = MonitoringGraph;
//# sourceMappingURL=monitorgraph.js.map