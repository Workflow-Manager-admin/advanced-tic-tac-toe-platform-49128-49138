import { create } from "zustand";
import { api, setAuthToken, getAuthToken } from "@/lib/api";

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  restore: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const result = await api.post("/auth/login", new URLSearchParams({
        username,
        password
      }));
      setAuthToken(result.data.access_token);
      set({ token: result.data.access_token, loading: false });
      // Uncomment and modify below section if backend exposes "/users/me" or similar for user info fetch:
      // try {
      //   const userInfo = await api.get("/users/me");
      //   set({ user: userInfo.data });
      // } catch {
      //   set({ user: null });
      // }
    } catch (error) {
      if (typeof error === "object" && error !== null && "response" in error) {
        set({
          error: (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
                 "Invalid login",
          loading: false
        });
      } else {
        set({ error: "Invalid login", loading: false });
      }
      setAuthToken(null);
    }
  },
  register: async (username, email, password) => {
    set({ loading: true, error: null });
    try {
      await api.post("/auth/register", { username, email, password });
      // Auto-login after registration
      await (useAuth.getState().login)(username, password);
    } catch (error) {
      if (typeof error === "object" && error !== null && "response" in error) {
        set({
          error: (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
                 "Registration failed",
          loading: false
        });
      } else {
        set({ error: "Registration failed", loading: false });
      }
      setAuthToken(null);
    }
  },
  logout: () => {
    setAuthToken(null);
    set({ user: null, token: null });
  },
  restore: () => {
    const token = getAuthToken();
    if (token) {
      setAuthToken(token);
      set({ token });
      // You may trigger fetch user info if desired here
    }
  }
}));
