import React from "react";

type GolfBallCardProps = {
  picture_url: string;
  name: string;
  summary: string;
  launch: string;
  spin: string;
  firmness: string;
  players_who_used: string[];
};

const GolfBallCard: React.FC<GolfBallCardProps> = ({
  picture_url,
  name,
  summary,
  launch,
  spin,
  firmness,
  players_who_used,
}) => {
  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      {/* Golf Ball Picture */}
      {picture_url && (
        <div className="w-full h-64 bg-gray-100 overflow-hidden">
          <img
            src={picture_url}
            alt={`${name} picture`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Name and Summary */}
      <div className="bg-gray-100 p-4">
        <h2 className="text-2xl font-semibold">{name}</h2>
        <p className="text-sm text-gray-600">{summary}</p>
      </div>

      {/* Specifications */}
      <div className="p-4">
        <p className="text-sm text-gray-600">
          <strong>Launch:</strong> {launch}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Spin:</strong> {spin}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Firmness:</strong> {firmness}
        </p>
      </div>

      {/* Players who used */}
      {players_who_used && players_who_used.length > 0 && (
        <div className="p-4">
          <p className="text-lg font-semibold mb-2">Players Who Used:</p>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {players_who_used.map((player, index) => (
              <li key={index}>{player}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GolfBallCard;
