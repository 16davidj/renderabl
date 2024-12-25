import React from "react";

export type TrafficCardProps = {
  traffic_qps: number[];
};

const TrafficCard: React.FC<TrafficCardProps> = ({ traffic_qps }) => {
  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      <div className="p-4">
        <h2 className="text-2xl font-semibold">Traffic Data</h2>
      </div>
      <div className="p-4">
        <p className="text-sm font-semibold">Queries Per Second (QPS):</p>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {traffic_qps.map((qps, index) => (
            <li key={index}>Interval {index + 1}: {qps} QPS</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TrafficCard;