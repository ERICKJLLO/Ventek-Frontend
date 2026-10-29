"use client";

import { useEffect, useState } from "react";
import { PrivatePage } from "@/components/PrivatePage";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => setDarkMode(window.localStorage.getItem("ventek-theme") !== "light"), []);

  function changeTheme(value: boolean) {
    setDarkMode(value);
    document.body.classList.toggle("light-mode", !value);
    window.localStorage.setItem("ventek-theme", value ? "dark" : "light");
  }

  return <PrivatePage><main className="auth-page"><section className="auth-panel">
    <p className="section-label">CUENTA</p><h1>Configuración</h1><p>Administra preferencias disponibles para este dispositivo.</p>
    <div className="form-group"><label htmlFor="theme-setting">Tema visual</label><select className="field" id="theme-setting" value={darkMode ? "dark" : "light"} onChange={(event) => changeTheme(event.target.value === "dark")}><option value="dark">Oscuro</option><option value="light">Claro</option></select></div>
    <p className="text-secondary">La preferencia de tema se conserva localmente, igual que el botón flotante del sitio.</p>
  </section></main></PrivatePage>;
}

