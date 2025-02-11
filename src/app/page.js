'use client';

import { useEffect, useState } from "react";

export default function Home() {
  const [userData, setUserData] = useState(null);
  const [appData, setAppData] = useState(null);
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

  // Fetch steam app list
  useEffect(() => {
    async function fetchAppList() {
      try {
        const response = await fetch('/api/appList');
        if (!response.ok) {
          throw new Error("Failed to fetch app list");
        }

        const data = await response.json();
        setAppData(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchAppList();
  }, []);

  // format unix time to locale time
  const formatUnixTime = (unixTime) => {
    const date = new Date(unixTime * 1000);
    return date.toLocaleString();
  };

  // parse game title from game id
  const formatGameTitle = (gameId) => {
    if (!appData || !appData.applist || !appData.applist.apps) return "Unknown Game";
    const app = appData.applist.apps.find(app => app.appid === parseInt(gameId));
    return app ? app.name : "Unknown Game";
  };

  // format the users status
  const formatStatus = (steamUser) => {
    const statusMap = {
      0: "Offline",
      1: "Online",
      2: "Away",
      3: "Snooze",
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
              <p
                className={`text-lg font-semibold ${formatStatus(steamUser) === "Offline" ? "text-red-500" :
                  formatStatus(steamUser) === "Online" ? "text-green-500" :
                    formatStatus(steamUser) === "Away" ? "text-yellow-500" :
                      "text-gray-700"
                  }`}
              >
                {formatStatus(steamUser)}
              </p>
              <div className="text-lg font-semibold text-gray-700">Last login:
                <p>{formatUnixTime(steamUser.lastlogoff)}</p>
              </div>
              <div className="text-lg font-semibold text-gray-700">Account created:
                <p>{formatUnixTime(steamUser.timecreated)}</p>
              </div>
              <div className="text-lg font-semibold text-gray-700">Current game:
                <p>{formatGameTitle(steamUser.gameid)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-white text-lg">Loading...</div>
      )}
    </div>
  );
}
