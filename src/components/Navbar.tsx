"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const { user, isReady, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function closeProfile(event: MouseEvent) {
      if (!profileRef.current?.contains(event.target as Node)) setProfileOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setProfileOpen(false);
    }
    document.addEventListener("mousedown", closeProfile);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeProfile);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const initials = user?.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() ?? "";

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
            {isReady && !user && <li className="nav-login-mobile"><Link href="/login" className="nav-login-button" onClick={closeMenu}>Iniciar sesión</Link></li>}
          </ul>
          <Link href="/#contacto" className="nav-button">Solicitar servicio</Link>
          {isReady && !user && <Link href="/login" className="nav-login-button nav-login-desktop">Iniciar sesión</Link>}
          {isReady && user && <div className="profile-menu" ref={profileRef}>
            <button type="button" className="profile-button" aria-label="Abrir menú de perfil" aria-expanded={profileOpen} onClick={() => setProfileOpen((open) => !open)}>
              <span>{initials}</span>
            </button>
            {profileOpen && <div className="profile-dropdown" role="menu">
              <Link href="/perfil" role="menuitem" onClick={() => setProfileOpen(false)}>Mi perfil</Link>
              <Link href="/configuracion" role="menuitem" onClick={() => setProfileOpen(false)}>Configuración</Link>
              <Link href="/seguridad" role="menuitem" onClick={() => setProfileOpen(false)}>Seguridad</Link>
              <button type="button" role="menuitem" onClick={() => { setProfileOpen(false); logout(); }}>Cerrar sesión</button>
            </div>}
          </div>}
        </nav>
      </header>
      <button type="button" className="theme-button" onClick={toggleTheme} aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}>{darkMode ? "☀️" : "🌙"}</button>
      <button type="button" className={`back-to-top-button${showTop ? " visible" : ""}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Volver arriba" title="Volver arriba">↑</button>
    </>
  );
}
