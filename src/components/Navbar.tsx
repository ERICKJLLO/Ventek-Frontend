"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";

export function Navbar() {
  const { user, isReady, logout } = useAuth();
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const saved = window.localStorage.getItem("ventek-theme");
    const isDark = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
    setDark(isDark);
  }, []);
  function toggleTheme() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("ventek-theme", next ? "dark" : "light");
    setDark(next);
  }
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-[#0d0d0f]/90">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-5 py-4" aria-label="Navegación principal">
        <Link href="/" className="text-xl font-black tracking-[0.3em] text-ink dark:text-white">VENTEK</Link>
        <button type="button" onClick={() => setMenuOpen((open) => !open)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:hidden dark:border-slate-700" aria-expanded={menuOpen} aria-controls="mobile-menu">☰<span className="sr-only">Abrir menú</span></button>
        <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
          <Link href="/#servicios" className="hover:text-ink dark:hover:text-white">Servicios</Link>
          <Link href="/#proceso" className="hover:text-ink dark:hover:text-white">Cómo trabajamos</Link>
          <Link href="/#nosotros" className="hover:text-ink dark:hover:text-white">Nosotros</Link>
          {isReady && user && <Link href="/interacciones" className="hover:text-ink dark:hover:text-white">Mis solicitudes</Link>}
          {isReady && user?.role === "admin" && <Link href="/admin" className="hover:text-ink dark:hover:text-white">Administración</Link>}
        </div>
        <div className="hidden items-center gap-3 md:flex">{!isReady ? <span className="h-9 w-24 animate-pulse rounded-full bg-slate-100" /> : user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 dark:text-slate-400">Hola, {user.name.split(" ")[0]}</span>
            <button onClick={logout} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-ink hover:border-ink dark:border-slate-700 dark:text-white">Salir</button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-full px-3 py-2 text-sm font-semibold text-ink hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800">Iniciar sesión</Link>
            <Link href="/registro" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">Registrarme</Link>
          </div>
        )}</div>
        <button type="button" onClick={toggleTheme} className="hidden rounded-full border border-slate-300 px-3 py-2 text-sm md:block dark:border-slate-700" aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}>{dark ? "☀️" : "🌙"}</button>
      </nav>
      {menuOpen && <div id="mobile-menu" className="border-t border-slate-200 px-5 pb-4 md:hidden dark:border-slate-800"><div className="flex flex-col gap-3 pt-4 text-sm font-medium dark:text-slate-200"><Link onClick={() => setMenuOpen(false)} href="/#servicios">Servicios</Link><Link onClick={() => setMenuOpen(false)} href="/#proceso">Cómo trabajamos</Link><Link onClick={() => setMenuOpen(false)} href="/#nosotros">Nosotros</Link>{isReady && user && <Link onClick={() => setMenuOpen(false)} href="/interacciones">Mis solicitudes</Link>}{isReady && user?.role === "admin" && <Link onClick={() => setMenuOpen(false)} href="/admin">Administración</Link>}<button type="button" onClick={toggleTheme} className="self-start">{dark ? "☀️ Modo claro" : "🌙 Modo oscuro"}</button>{isReady && user ? <button type="button" onClick={logout} className="self-start font-semibold">Salir</button> : <Link onClick={() => setMenuOpen(false)} href="/login">Iniciar sesión</Link>}</div></div>}
    </header>
  );
}
