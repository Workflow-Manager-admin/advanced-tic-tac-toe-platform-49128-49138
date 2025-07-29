"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import Input from "@/components/Input";

export default function LoginPage() {
  const router = useRouter();
  const { login, error, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password) {
      setFormError("Username and password are required");
      return;
    }
    setFormError(null);
    await login(username, password);
    if (!error) {
      router.push("/play");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-light">
      <div className="rounded-xl border px-8 py-10 shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-4 text-primary">Sign In</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <Input
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {(error || formError) && (
            <div className="text-red-500 text-sm mb-2">{error || formError}</div>
          )}
          <button
            type="submit"
            className="bg-primary text-white rounded py-2 font-bold mt-2 transition hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-sm">Don&apos;t have an account?</span>
          <button
            onClick={() => router.push("/register")}
            className="ml-2 text-primary font-semibold underline"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
