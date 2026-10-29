"use client";

import { useState } from "react";
import { PrivatePage } from "@/components/PrivatePage";
import { ApiError } from "@/services/http-client";
import { authService } from "@/services/auth-service";

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (newPassword.length < 8) { setError("La nueva contraseña debe tener al menos 8 caracteres."); return; }
    if (newPassword !== confirmation) { setError("Las contraseñas nuevas no coinciden."); return; }
    setSaving(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      setCurrentPassword(""); setNewPassword(""); setConfirmation("");
      setNotice("Contraseña actualizada correctamente.");
    } catch (reason: unknown) {
      setError(reason instanceof ApiError ? reason.message : "No se pudo actualizar la contraseña.");
    } finally {
      setSaving(false);
    }
  }

  return <PrivatePage><main className="auth-page"><section className="auth-panel">
    <p className="section-label">CUENTA</p><h1>Seguridad</h1><p>Cambia tu contraseña con una sesión autenticada.</p>
    <form onSubmit={submit}>
      <div className="form-group"><label htmlFor="current-password">Contraseña actual</label><input className="field" id="current-password" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required disabled={saving} /></div>
      <div className="form-group"><label htmlFor="new-password">Nueva contraseña</label><input className="field" id="new-password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={8} required disabled={saving} /></div>
      <div className="form-group"><label htmlFor="confirm-password">Confirmar nueva contraseña</label><input className="field" id="confirm-password" type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} minLength={8} required disabled={saving} /></div>
      {error && <p className="error-message" role="alert">{error}</p>}
      {notice && <p id="form-message" role="status">{notice}</p>}
      <button className="button primary-button" type="submit" disabled={saving}>{saving ? "Guardando..." : "Cambiar contraseña"}</button>
    </form>
  </section></main></PrivatePage>;
}

