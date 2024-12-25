import React from "react";

export type TrafficAgentCardProps = {
  traffic_qps: number[];
};

const TrafficAgentCard: React.FC<TrafficAgentCardProps> = ({ traffic_qps }) => {
  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      {/* Card Header */}
      <div className="bg-gray-100 p-4">
        <h2 className="text-2xl font-semibold">Traffic Monitoring</h2>
      </div>

      {/* Traffic Details */}
      <div className="p-4">
        <p className="text-sm font-semibold">Queries Per Second (QPS):</p>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {traffic_qps.map((qps, index) => (
            <li key={index}>
              Interval {index + 1}: {qps} QPS
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TrafficAgentCard;