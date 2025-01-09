'use client';

import { useEffect, useState } from "react";

export default function Home() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch user steam data from api route
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api');
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchUserData();
  }, []);

  // format unix time to locale time
  const formatUnixTime = (unixTime) => {
    const date = new Date(unixTime * 1000);
    return date.toLocaleString();
  };

  // formate the users status
  const formatStatus = (steamUser) => {
    const statusMap = {
      0: "Offline",
      1: "Online",
      2: "Busy",
      3: "Away",
      4: "Snooze",
    };

    return statusMap[steamUser.personastate];
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {error ? (
        <div className="text-red-500 text-lg font-bold">Error: {error}</div>
      ) : userData ? (
        <div className="space-y-6">
          {userData.response.players.map((steamUser) => (
            <div
              key={steamUser.steamid}
              className="flex flex-col items-center text-center space-y-2 bg-white shadow-md rounded-lg p-4"
            >
              <img
                src={steamUser.avatarfull}
                alt={`${steamUser.personaname}'s avatar`}
                className="w-184 h-184 rounded-full"
              />
              <p className="text-3xl font-semibold text-gray-700">{steamUser.personaname}</p>
              <p className="text-lg font-semibold text-gray-700">{formatStatus(steamUser)}</p>
              <div className="text-lg font-semibold text-gray-700">Last login:
                <p>{formatUnixTime(steamUser.lastlogoff)}</p>
              </div>
              <div className="text-lg font-semibold text-gray-700">Account created:
                <p>{formatUnixTime(steamUser.timecreated)}</p>
              </div>
              <p className="text-lg font-semibold text-gray-700">Current game: {steamUser.gameid}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-600 text-lg">Loading...</div>
      )}
    </div>
  );
}
