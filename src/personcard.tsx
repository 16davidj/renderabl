import React from "react";

type PersonCardProps = {
  name: string;
  summary: string;
  birthday: string;
  death: string;
  age: number;
  occupation_best_known_for_five_or_less_words: string;
  alma_mater: string;
  hometown: string;
  spouses: string[];
  awards: string[];
  profilePictureUrl?: string;
};

const PersonCard: React.FC<PersonCardProps> = ({
  name,
  summary,
  birthday,
  death,
  age,
  occupation_best_known_for_five_or_less_words,
  alma_mater,
  hometown,
  spouses,
  awards,
  profilePictureUrl,
}) => {
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

      {/* Name and Occupation */}
      <div className="bg-gray-100 p-4 text-center">
        <h2 className="text-2xl font-semibold">{name}</h2>
        <p className="text-sm text-gray-600 italic">
          {occupation_best_known_for_five_or_less_words}
        </p>
      </div>

      {/* Summary and Details */}
      <div className="p-4">
        <p className="text-sm text-gray-700 mb-2">{summary}</p>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p><strong>Born:</strong> {birthday}</p>
            <p><strong>Died:</strong> {death}</p>
            <p><strong>Age:</strong> {age} years</p>
          </div>
          <div>
            <p><strong>Hometown:</strong> {hometown}</p>
            <p><strong>Alma Mater:</strong> {alma_mater}</p>
          </div>
        </div>

        {/* Spouses */}
        <div className="mt-4">
          <p className="text-sm font-semibold">Spouses:</p>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {spouses.map((spouse, index) => (
              <li key={index}>{spouse}</li>
            ))}
          </ul>
        </div>

        {/* Awards */}
        <div className="mt-4">
          <p className="text-sm font-semibold">Awards:</p>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {awards.map((award, index) => (
              <li key={index}>{award}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PersonCard;