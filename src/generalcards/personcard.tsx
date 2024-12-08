import React from "react";
import { PersonCardProps } from "../types";

const PersonCard: React.FC<PersonCardProps> = ({
  name,
  summary,
  birthday,
  death,
  age,
  occupation,
  almaMater,
  hometown,
  spouses,
  awards,
  profilePictureUrl,
}) => {
  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 justify-start">
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

      {/* Name and Occupation */}
      <div className="bg-gray-100 p-4 text-left">
        <h2 className="text-2xl font-semibold">{name}</h2>
        <p className="text-sm text-gray-600 italic">
          {occupation}
        </p>
      </div>

      {/* Summary and Details */}
      <div className="p-4">
        <p className="text-sm text-gray-700 mb-2">{summary}</p>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p><strong>Born:</strong> {birthday}</p>
            {death &&<p><strong>Died:</strong> {death}</p>}
            <p><strong>Age:</strong> {age} years</p>
          </div>
          <div>
            <p><strong>Hometown:</strong> {hometown}</p>
            <p><strong>Alma Mater:</strong> {almaMater}</p>
          </div>
        </div>

        {/* Spouses */}
        {spouses && spouses.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold">Spouses:</p>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {spouses.map((spouse, index) => (
              <li key={index}>{spouse}</li>
            ))}
          </ul>
        </div>)}

        {/* Awards */}
       {awards && awards.length > 0 && (<div className="mt-4">
          <p className="text-sm font-semibold">Awards:</p>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {awards.map((award, index) => (
              <li key={index}>{award}</li>
            ))}
          </ul>
        </div>)}
      </div>
    </div>
  );
};

export default PersonCard;
