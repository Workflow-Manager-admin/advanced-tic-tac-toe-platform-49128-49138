"use client";
import useSWR from "swr";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";
import { format } from "date-fns";

interface GameSummary {
  id: number;
  opponent_username: string;
  is_winner: boolean | null;
  status: string;
  created_at: string;
}

export default function HistoryPanel() {
  const { token } = useAuth();

  const fetcher = (url: string) =>
    api.get(url, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);

  const { data, error } = useSWR(token ? "/history" : null, fetcher);

  return (
    <div className="p-3">
      <div className="font-semibold text-dark text-sm mb-2">Recent Games</div>
      {!token && <div className="text-xs text-gray-400">Log in to see your history.</div>}
      {error && <div className="text-xs text-red-500">Failed to load games.</div>}
      <ul className="flex flex-col gap-1">
        {(data ?? []).map((g: GameSummary) => (
          <li key={g.id} className="flex items-center gap-2 text-xs">
            <span className="font-mono bg-gray-200 rounded px-2 py-0.5">{format(new Date(g.created_at), "MMM d, HH:mm")}</span>
            <span>{g.opponent_username}</span>
            <span className={g.is_winner === true ? "text-accent" : g.is_winner == null ? "text-gray-400" : "text-secondary"}>
              {g.is_winner == null ? "Draw" : g.is_winner ? "Win" : "Loss"}
            </span>
            <span className="ml-auto">{g.status}</span>
          </li>
        ))}
        {data && data.length === 0 && (
          <li className="text-xs text-gray-400">No previous games.</li>
        )}
      </ul>
    </div>
  );
}
