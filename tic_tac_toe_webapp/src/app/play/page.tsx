"use client";
import { useEffect } from "react";
import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import GameBoard from "@/components/GameBoard";
import SidePanel from "@/components/SidePanel";

export default function PlayPage() {
  const router = useRouter();
  const { token, restore } = useAuth();

  useEffect(() => {
    restore();
    if (!token) {
      router.replace("/login");
    }
  }, [token, restore, router]);

  // Layout: main play area with side panel for chat/history
  return (
    <main className="min-h-screen bg-light flex flex-col">
      <Header />
      <div className="flex flex-1 flex-col md:flex-row gap-0 md:gap-4 px-0 sm:px-4 py-4">
        <section className="flex-grow max-w-xl mx-auto md:mx-0 mb-6 md:mb-0">
          <GameBoard />
        </section>
        <aside className="w-full md:w-80 border-l border-gray-200 bg-gray-50">
          <SidePanel />
        </aside>
      </div>
    </main>
  );
}
