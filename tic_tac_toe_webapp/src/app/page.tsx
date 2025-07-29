"use client";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  return (
    <main className="flex flex-col min-h-screen bg-light">
      <Header />
      <section className="flex flex-col items-center justify-center flex-1 py-12">
        <div className="max-w-lg w-full flex flex-col items-center text-center gap-4">
          <h1 className="text-4xl font-black text-primary mb-2">Welcome to TicTacToe!</h1>
          <p className="text-lg text-dark mb-2">
            Challenge friends or random opponents in a modern, real-time Tic Tac Toe platform.
          </p>
          <div className="flex gap-4 mt-5">
            <button
              className="bg-primary text-white font-bold px-7 py-3 rounded-full shadow transition hover:bg-blue-600"
              onClick={() => router.push("/register")}
            >Get Started</button>
            <button
              className="bg-accent text-white font-bold px-7 py-3 rounded-full shadow transition hover:bg-green-600"
              onClick={() => router.push("/play")}
            >Play Now</button>
          </div>
        </div>
      </section>
    </main>
  );
}
