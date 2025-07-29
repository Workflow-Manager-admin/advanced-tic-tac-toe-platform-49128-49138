"use client";
import useSWR from "swr";
import { api } from "@/lib/api";
import Header from "@/components/Header";
import { useAuth } from "@/store/auth";
import { format } from "date-fns";

export default function HistoryPage() {
  const { token } = useAuth();
  const fetcher = (url: string) =>
    api.get(url, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);
  const { data, error } = useSWR(token ? "/history" : null, fetcher);

  type GameSummary = {
    id: number;
    opponent_username: string;
    is_winner: boolean | null;
    status: string;
    created_at: string;
  };

  return (
    <main className="min-h-screen bg-light flex flex-col">
      <Header />
      <section className="w-full max-w-2xl mx-auto mt-8 p-6 shadow bg-white rounded">
        <h2 className="text-2xl font-bold mb-2 text-primary">Match History</h2>
        {!token && <div className="text-sm text-gray-400">Login to see your match history.</div>}
        {error && <div className="text-sm text-red-500">Failed to load history.</div>}
        {Array.isArray(data) && data.length === 0 && (
          <div className="text-sm text-gray-400">No games played yet.</div>
        )}
        <ul>
          {Array.isArray(data) &&
            data.map((g: GameSummary) => (
              <li key={g.id} className="mb-1 flex gap-3 text-sm items-center">
                <span className="font-mono bg-gray-200 px-2 py-0.5 rounded">
                  {format(new Date(g.created_at), "MMM d, HH:mm")}
                </span>
                <span>{g.opponent_username}</span>
                <span
                  className={
                    g.is_winner === true
                      ? "text-accent"
                      : g.is_winner == null
                      ? "text-gray-400"
                      : "text-secondary"
                  }
                >
                  {g.is_winner == null ? "Draw" : g.is_winner ? "Win" : "Loss"}
                </span>
                <span className="ml-auto">{g.status}</span>
              </li>
            ))}
        </ul>
      </section>
    </main>
  );
}
