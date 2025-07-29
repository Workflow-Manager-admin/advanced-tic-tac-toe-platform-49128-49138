"use client";
import useSWR from "swr";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";
import Header from "@/components/Header";
import { format } from "date-fns";

interface LeaderboardEntry {
  user_id: number;
  username: string;
  wins: number;
  losses: number;
  draws: number;
  games_played: number;
  last_played: string | null;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const fetcher = (url: string) => api.get(url).then(res => res.data);
  const { data, error } = useSWR("/leaderboard", fetcher);

  return (
    <main className="min-h-screen bg-light flex flex-col">
      <Header />
      <section className="w-full max-w-2xl mx-auto mt-8 p-6 shadow bg-white rounded">
        <h2 className="text-2xl font-bold mb-4 text-primary">Leaderboard</h2>
        {error && <div className="text-red-500 text-sm">Failed to load leaderboard.</div>}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="px-2 py-1">#</th>
              <th className="px-2 py-1">Player</th>
              <th className="px-2 py-1">W</th>
              <th className="px-2 py-1">L</th>
              <th className="px-2 py-1">D</th>
              <th className="px-2 py-1">Games</th>
              <th className="px-2 py-1">Last Played</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.map((entry: LeaderboardEntry, i: number) => (
              <tr
                key={entry.user_id}
                className={user && entry.user_id === user.id ? "bg-blue-50 font-semibold" : ""}
              >
                <td className="px-2 py-1">{i + 1}</td>
                <td className="px-2 py-1">{entry.username}</td>
                <td className="px-2 py-1">{entry.wins}</td>
                <td className="px-2 py-1">{entry.losses}</td>
                <td className="px-2 py-1">{entry.draws}</td>
                <td className="px-2 py-1">{entry.games_played}</td>
                <td className="px-2 py-1">{entry.last_played ? format(new Date(entry.last_played), "MMM d HH:mm") : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {Array.isArray(data) && data.length === 0 &&
          <div className="text-sm text-gray-400 mt-4">No leaderboard data yet.</div>
        }
      </section>
    </main>
  );
}
