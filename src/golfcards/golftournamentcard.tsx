import React, {useState} from "react";
import { PlayerScoreType, Message} from "../types";

export type GolfTournamentCardProps = {
  name: string;
  location: string;
  course: string;
  summary: string;
  dates: string;
  weather: string;
  purse: number;
  players: PlayerScoreType[];
  coursePictureUrl?: string;
  ytHighlightsId?: string;
  year: number;
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const GolfTournamentCard: React.FC<GolfTournamentCardProps> = ({
  name,
  location,
  course,
  summary,
  dates,
  weather,
  purse,
  players,
  coursePictureUrl,
  ytHighlightsId,
  year,
  messages,
  setMessages
}) => {
    const fetchGolfPlayer = async (name: string, year: number) => {
        const response = await fetch(`http://localhost:5500/api/renderabl`, {
            method:'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: [{role: 'user', content: name + " in " + year}] })
        });
        const responseMsg : Message = JSON.parse(await response.text())
        setMessages([...messages, responseMsg])
    }
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const handleMouseEnter = (index: number) => setHoveredIndex(index);
    const handleMouseLeave = () => setHoveredIndex(null);
  return (
    <div className="inline-block w-3/4 max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      {/* Course Picture */}
      {coursePictureUrl && (
        <div className="w-full h-68 bg-gray-100 overflow-hidden">
          <img
            src={coursePictureUrl}
            alt={`${course} Course`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="bg-gray-100 p-4">
        <h2 className="text-2xl font-semibold">{name + " " + "(" + year + ")"}</h2>
        <p className="text-sm text-gray-600">{course}</p>
      </div>

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

      {/* YouTube Video Player */}
      {ytHighlightsId && (
       <div className="p-4">
       <p className="text-lg font-semibold mb-2">Highlights</p>
       <div className="relative w-full aspect-w-16 aspect-h-9"> {/* Flexible aspect ratio container */}
         <iframe
           src={`https://www.youtube.com/embed/${ytHighlightsId}`}
           title="YouTube video player"
           className="w-full h-full"
           allowFullScreen
         ></iframe>
       </div>
     </div>
      )}

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
                    <td onClick={() => {fetchGolfPlayer(player.name, year)}}
                        onMouseEnter = {() => handleMouseEnter(index)}
                        onMouseLeave = {handleMouseLeave}
                        style = {{cursor: 'pointer', textDecoration: hoveredIndex === index ? 'underline' : 'none',}} className="px-4 py-2 text-left">{player.name}</td>
                    <td className="px-4 py-2 text-center">
                      {player.roundScores[0]}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {player.roundScores[1]}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {player.roundScores[2]}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {player.roundScores[3] }
                    </td>
                    <td className="px-4 py-2 text-center">{player.finalScore}</td>
                    <td className="px-4 py-2 text-right">
                      ${player.prizeMoney.toLocaleString()}
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
