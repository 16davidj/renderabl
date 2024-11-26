import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { format } from "date-fns";
import { MonitoringGraphProps } from "./types";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MonitoringGraph : React.FC<MonitoringGraphProps> = ({ handlerName, inputData }) => {
  // Prepare the data for the chart
  const chartData = {
    labels: inputData.map((dataPoint) =>
      format(new Date(dataPoint.timestamp), "yyyy-MM-dd HH:mm:ss")
    ), // Convert timestamps to human-readable date/time
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
        position: "top" as const,
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

  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MonitoringGraph;
