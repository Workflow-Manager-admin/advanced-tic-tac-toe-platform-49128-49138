"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import classNames from "classnames";

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  return (
    <header className="w-full px-4 py-3 flex items-center bg-primary text-light shadow">
      <Link href="/" className="text-xl font-bold tracking-wide mr-6 text-light">
        <span>TicTacToe</span>
      </Link>
      <nav className="flex gap-4">
        <Link href="/play" className={classNames(
          "font-semibold hover:underline",
          path.startsWith("/play") && "underline"
        )}>Play</Link>
        <Link href="/leaderboard" className={classNames(
          "font-semibold hover:underline",
          path.startsWith("/leaderboard") && "underline"
        )}>Leaderboard</Link>
        <Link href="/history" className={classNames(
          "font-semibold hover:underline",
          path.startsWith("/history") && "underline"
        )}>History</Link>
      </nav>
      <div className="ml-auto flex items-center gap-3">
        {user
          ? (
            <>
              <span className="font-medium">{user.username}</span>
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="bg-secondary px-3 py-1 rounded text-primary font-semibold ml-2 transition hover:bg-yellow-400"
              >Logout</button>
            </>
          )
          : (
            <>
              <Link href="/login" className="font-semibold underline text-secondary">Login</Link>
              <Link href="/register" className="ml-2 font-semibold underline text-accent">Register</Link>
            </>
          )
        }
      </div>
    </header>
  );
}
