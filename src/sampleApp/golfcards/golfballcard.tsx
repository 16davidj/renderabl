import React from "react";

export type GolfBallCardProps = {
  picture_url: string;
  name: string;
  summary: string;
  launch: string;
  spin: string;
  year_introduced: number;
  firmness: string;
  players: string[];
};

const GolfBallCard: React.FC<GolfBallCardProps> = ({
  picture_url,
  name,
  summary,
  launch,
  spin,
  year_introduced,
  firmness,
  players
}) => {
  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      <div className="w-full h-64 bg-gray-100 overflow-hidden">
        <img
          src={picture_url}
          alt={`${name} image`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="bg-gray-100 p-4">
        <h2 className="text-2xl font-semibold">{name}</h2>
        <p className="text-sm text-gray-600">Introduced: {year_introduced}</p>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-600">
          <strong>Summary:</strong> {summary}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Launch Characteristics:</strong> {launch}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Spin Characteristics:</strong> {spin}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Firmness:</strong> {firmness}
        </p>
      </div>

      {players && players.length > 0 && (
        <div className="p-4">
          <p className="text-sm font-semibold">Players Who Used:</p>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {players.map((player, index) => (
              <li key={index}>{player}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GolfBallCard;