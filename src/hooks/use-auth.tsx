"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@/domain/types";
import { httpClient } from "@/services/http-client";

const STORAGE_KEY = "ventek-session";
interface Session { token: string; user: User }
interface AuthContextValue {
  user: User | null;
  isReady: boolean;
  login: (session: Session) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const saved = JSON.parse(raw) as Session;
        if (saved.token && saved.user) {
          setSession(saved);
          httpClient.setToken(saved.token);
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    function handleUnauthorized() {
      setSession(null);
      httpClient.setToken(null);
      window.localStorage.removeItem(STORAGE_KEY);
    }
    window.addEventListener("ventek:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("ventek:unauthorized", handleUnauthorized);
  }, []);

  const login = useCallback((nextSession: Session) => {
    setSession(nextSession);
    httpClient.setToken(nextSession.token);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    httpClient.setToken(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(() => ({ user: session?.user ?? null, isReady, login, logout }), [session, isReady, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe utilizarse dentro de AuthProvider.");
  return context;
}
