"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
// import { io } from 'socket.io-client'; (optionally for live updates)

interface MoveInfo {
  move_number: number;
  cell_position: number;
  symbol: string;
  player_id: number;
  created_at: string;
}

interface GameStatus {
  id: number;
  board_state: string; // "_________"
  moves: MoveInfo[];
  status: string; // "waiting", "playing", "finished"
  player_x_id: number;
  player_o_id: number | null;
  winner_id: number | null;
}

export default function GameBoard() {
  const [game, setGame] = useState<GameStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [availableGames, setAvailableGames] = useState<GameStatus[]>([]);
  const [error, setError] = useState<string | null>(null);

  // For simplicity, not using real-time here yet (see backend for websocket/use websocket-hooks)
  async function createGame() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/games/");
      setGame(res.data);
    } catch (err) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        (err as { response?: { data?: { detail?: string } } }).response?.data
      ) {
        setError(
          (err as { response?: { data?: { detail?: string } } }).response?.data?.detail ??
            "Unable to start game."
        );
      } else {
        setError("Unable to start game.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function fetchAvailableGames() {
    setError(null);
    try {
      const res = await api.get("/games/available");
      setAvailableGames(res.data as GameStatus[]);
    } catch {
      setAvailableGames([]);
    }
  }

  async function joinGame(game_id: number) {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/games/join", { game_id });
      setGame(res.data);
    } catch {
      setError("Could not join game.");
    } finally {
      setLoading(false);
    }
  }

  function getCellSymbol(pos: number): string {
    if (!game || !game.board_state) return "";
    const symbol = game.board_state.charAt(pos);
    return symbol === "_" ? "" : symbol || "";
  }

  async function makeMove(pos: number) {
    if (!game || game.status !== "playing") return;
    if (getCellSymbol(pos)) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/games/move", {
        game_id: game.id,
        cell_position: pos,
      });
      setGame(res.data);
    } catch (err) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        (err as { response?: { data?: { detail?: string } } }).response?.data
      ) {
        setError(
          (err as { response?: { data?: { detail?: string } } }).response?.data?.detail || "Invalid move."
        );
      } else {
        setError("Invalid move.");
      }
    } finally {
      setLoading(false);
    }
  }

  // Fetch lobby/available games on mount
  useEffect(() => {
    fetchAvailableGames();
  }, []);

  if (!game) {
    return (
      <div className="p-6 bg-light rounded shadow border flex flex-col items-center max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-2 text-primary">Tic Tac Toe Game</h2>
        <div className="mb-4">
          <button
            className="bg-primary text-white rounded px-5 py-2 font-bold mr-2"
            disabled={loading}
            onClick={createGame}
          >
            Start a new game
          </button>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-dark">Or join a waiting game:</h3>
          <ul>
            {availableGames.length === 0 && (
              <li className="text-gray-400">No available games.</li>
            )}
            {availableGames.map((g: GameStatus) => (
              <li key={g.id}>
                <button
                  onClick={() => joinGame(g.id)}
                  className="underline text-accent hover:text-primary px-2"
                  disabled={loading}
                >
                  Game #{g.id}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}
      </div>
    );
  }

  // Game board UI
  return (
    <div className="p-6 bg-light rounded shadow border max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-2 text-primary">
        Game #{game.id}{" "}
        <span className="ml-2 text-xs bg-secondary text-primary px-2 py-1 rounded">
          {game.status}
        </span>
      </h2>
      <div className="mt-2 mb-4 grid grid-cols-3 gap-1 w-52 h-52 mx-auto">
        {[...Array(9)].map((_, i) => (
          <button
            key={i}
            disabled={
              !!getCellSymbol(i) || loading || game.status !== "playing"
            }
            onClick={() => makeMove(i)}
            className="w-16 h-16 border rounded-md flex items-center justify-center text-3xl font-bold transition
              hover:bg-primary/20 bg-gray-50"
          >
            {getCellSymbol(i)}
          </button>
        ))}
      </div>
      <div className="mb-2 text-dark">
        Status: <strong>{game.status}</strong>
      </div>
      {game.status === "finished" && (
        <div className="text-accent font-bold">
          Game over! {game.winner_id ? `Winner: Player ${game.winner_id}` : "Draw"}
        </div>
      )}
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  );
}
