"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { LoadingState } from "./LoadingState";

export function PrivatePage({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, isReady } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (isReady && (!user || (adminOnly && user.role !== "admin"))) router.replace(user ? "/" : "/login");
  }, [adminOnly, isReady, router, user]);
  if (!isReady || !user || (adminOnly && user.role !== "admin")) return <main className="mx-auto max-w-6xl px-5 py-20"><LoadingState label="Verificando sesión..." /></main>;
  return <>{children}</>;
}
