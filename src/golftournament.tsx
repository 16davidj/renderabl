import React from "react";
import { GolfTournamentCardProps, PlayerScoreType } from "./types";

const GolfTournamentCard: React.FC<GolfTournamentCardProps> = ({
  name,
  location,
  course,
  summary,
  dates,
  weather,
  purse,
  players,
  course_picture_url,
  yt_highlights,
}) => {
  return (
    <div className="inline-block w-3/4 max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      {/* Course Picture */}
      {course_picture_url && (
        <div className="w-full h-68 bg-gray-100 overflow-hidden">
          <img
            src={course_picture_url}
            alt={`${course} Course`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="bg-gray-100 p-4">
        <h2 className="text-2xl font-semibold">{name}</h2>
        <p className="text-sm text-gray-600">{course}</p>
      </div>

      {/* Location and Dates */}
      <div className="p-4">
        <p className="text-sm text-gray-600">
          <strong>Location:</strong> {location}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Dates:</strong> {dates}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Weather:</strong> {weather}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Purse:</strong> ${purse.toLocaleString()}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Summary:</strong> {summary.toLocaleString()}
        </p>
      </div>

      {/* Leaderboard */}
      {players && players.length > 0 && (
        <div className="p-4">
          <p className="text-lg font-semibold mb-2">Leaderboard</p>
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Position</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-center">R1</th>
                <th className="px-4 py-2 text-center">R2</th>
                <th className="px-4 py-2 text-center">R3</th>
                <th className="px-4 py-2 text-center">R4</th>
                <th className="px-4 py-2 text-center">Final</th>
                <th className="px-4 py-2 text-right">Prize Money</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => {
                return (
                  <tr
                    key={index}
                    className={`border-t ${index % 2 === 0 ? "bg-gray-100" : ""}`}
                  >
                    <td className="px-4 py-2 text-left">{player.position}</td>
                    <td className="px-4 py-2 text-left">{player.name}</td>
                    <td className="px-4 py-2 text-center">
                      {player.round_scores[0]}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {player.round_scores[1]}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {player.round_scores[2]}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {player.round_scores[3] }
                    </td>
                    <td className="px-4 py-2 text-center">{player.final_score}</td>
                    <td className="px-4 py-2 text-right">
                      ${player.prize_money.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GolfTournamentCard;
