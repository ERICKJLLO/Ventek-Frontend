"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const { user, isReady, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("ventek-theme");
    const dark = saved ? saved === "dark" : true;
    document.body.classList.toggle("light-mode", !dark);
    setDarkMode(dark);
    const onScroll = () => {
      const active = window.scrollY > 80;
      setScrolled(active);
      setShowTop(active);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toggleTheme() {
    const next = !darkMode;
    document.body.classList.toggle("light-mode", !next);
    window.localStorage.setItem("ventek-theme", next ? "dark" : "light");
    setDarkMode(next);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header className={scrolled ? "scrolled" : ""}>
        <nav>
          <Link href="/#inicio" className="logo" onClick={closeMenu}>VENTEK</Link>
          <button type="button" className="menu-button" aria-label="Abrir menú" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>☰</button>
          <ul id="nav-menu" className={menuOpen ? "active" : ""}>
            <li><Link href="/#inicio" onClick={closeMenu}>Inicio</Link></li>
            <li><Link href="/#servicios" onClick={closeMenu}>Servicios</Link></li>
            <li><Link href="/#proceso" onClick={closeMenu}>Cómo trabajamos</Link></li>
            <li><Link href="/#nosotros" onClick={closeMenu}>Nosotros</Link></li>
            <li><Link href="/#contacto" onClick={closeMenu}>Contacto</Link></li>
            {isReady && user && <li><Link href="/interacciones" onClick={closeMenu}>Mis solicitudes</Link></li>}
            {isReady && user?.role === "admin" && <li><Link href="/admin" onClick={closeMenu}>Administración</Link></li>}
          </ul>
          {isReady && user ? (
            <button type="button" className="nav-button" onClick={logout}>Cerrar sesión</button>
          ) : (
            <Link href={isReady ? "/login" : "/#contacto"} className="nav-button">Solicitar servicio</Link>
          )}
        </nav>
      </header>
      <button type="button" className="theme-button" onClick={toggleTheme} aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}>{darkMode ? "☀️" : "🌙"}</button>
      <button type="button" className={`back-to-top-button${showTop ? " visible" : ""}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Volver arriba" title="Volver arriba">↑</button>
    </>
  );
}
