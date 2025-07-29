"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import Input from "@/components/Input";

export default function RegisterPage() {
  const router = useRouter();
  const { register, error, loading } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      setFormError("All fields are required");
      return;
    }
    setFormError(null);
    await register(form.username, form.email, form.password);
    if (!error) {
      router.push("/play");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-light">
      <div className="rounded-xl border px-8 py-10 shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-4 text-primary">Register</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <Input
            label="Username"
            value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            autoComplete="username"
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            autoComplete="new-password"
          />
          {(error || formError) && (
            <div className="text-red-500 text-sm mb-2">{error || formError}</div>
          )}
          <button
            type="submit"
            className="bg-primary text-white rounded py-2 font-bold mt-2 transition hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-sm">Already have an account?</span>
          <button
            onClick={() => router.push("/login")}
            className="ml-2 text-primary font-semibold underline"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
