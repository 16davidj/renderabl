import React, {useState} from "react";

import { Message } from "../types";

export type GolfPlayerCardProps = {
  name: string;
  year?: number;
  height: string;
  birthday: string;
  rank: number;
  tour: "LIV" | "PGA" | "DP" | "Korn Ferry" | "Asia" | "LPGA" | "Champions";
  tourLogoUrl?: string;
  almaMater: string;
  hometown: string;
  firstWin?: string;
  recentWin?: string;
  profilePictureUrl?: string;
  sponsor: "TaylorMade" | "Titleist" | "Callaway" | "Ping" | "Mizuno" | "Srixon" | "Wilson" | "PXG" | "Nike" | "Adams";
  sponsorLogoUrl?: string;
  clubs: string[];
  ball: string;
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};

const GolfPlayerCard: React.FC<GolfPlayerCardProps> = ({
  name,
  year,
  height,
  birthday,
  rank,
  tourLogoUrl,
  almaMater,
  hometown,
  recentWin,
  firstWin,
  profilePictureUrl,
  sponsorLogoUrl,
  clubs,
  ball,
  messages,
  setMessages
}) => {
  const fetchWin = async (win: string) => {
    const response = await fetch(`http://localhost:5500/api/renderabl`, {
        method:'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: [{role: 'user', content: win}] })
    });
    const responseMsg : Message = JSON.parse(await response.text())
    setMessages([...messages, responseMsg])
  }

  const [isFirstWinHovered, setFirstWinIsHovered] = useState(false);
  const [isRecentWinHovered, setRecentWinIsHovered] = useState(false);

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      {/* Profile Picture */}
      {profilePictureUrl && (
        <div className="w-full h-64 bg-gray-100 overflow-hidden">
          <img
            src={profilePictureUrl}
            alt={`${name} profile`}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      

      {/* Name, Rank, Tour Logo, and Sponsor Logo */}
      <div className="bg-gray-100 p-4 flex items-center justify-between">
        <div className="flex items-center">
          {tourLogoUrl && (
            <img
              src={tourLogoUrl}
              alt="Tour Logo"
              className="h-8 w-8 mr-2 object-contain"
            />
          )}
          <div>
            <h2 className="text-2xl font-semibold">{year ? name + " (" + year + ")" : name }</h2>
            <p className="text-sm text-gray-600">Rank: {rank}</p>
          </div>
        </div>
        {sponsorLogoUrl && (
          <div>
            <img
              src={sponsorLogoUrl}
              alt={`Sponsor Logo`}
              className="h-8 w-16 object-contain"
            />
          </div>
        )}
      </div>

      {/* Player Details */}
      <div className="p-4">
        {/* Birthday and Age */}
        <div className="text-sm text-gray-600 mb-2">
          <p>
            <strong>Born:</strong> {birthday}
          </p>
        </div>

        {/* Other Information */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p><strong>Hometown:</strong> {hometown}</p>
            <p><strong>Height:</strong> {height}</p>
          </div>
          <div>
            <p><strong>Alma Mater:</strong> {almaMater}</p>
            {firstWin && (
              <p onClick={() => fetchWin(firstWin)}
              onMouseEnter = {() => setFirstWinIsHovered(true)}
              onMouseLeave = {() => setFirstWinIsHovered(false)}
            style = {{cursor: 'pointer', textDecoration: isFirstWinHovered ? 'underline' : 'none'}}>
                <strong>First Win:</strong> {firstWin}
              </p>
            )}
            {recentWin && (
              <p onClick={() => fetchWin(recentWin)}
              onMouseEnter = {() => setRecentWinIsHovered(true)}
              onMouseLeave = {() => setRecentWinIsHovered(false)}
            style = {{cursor: 'pointer', textDecoration: isRecentWinHovered ? 'underline' : 'none'}}>
                <strong>Recent Win:</strong> {recentWin}
              </p>
            )}
          </div>
        </div>

        {/* Ball */}
        <div className="mt-4">
          <p className="text-sm font-semibold">Ball Used:</p>
          <p className="text-sm text-gray-700">{ball}</p>
        </div>

        {/* Clubs */}
        {clubs && clubs.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold">Clubs:</p>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {clubs.map((club, index) => (
                <li key={index}>{club}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default GolfPlayerCard;
