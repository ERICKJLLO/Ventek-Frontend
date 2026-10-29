"use client";

import { useEffect, useState } from "react";
import { PrivatePage } from "@/components/PrivatePage";
import { ApiError } from "@/services/http-client";
import { authService } from "@/services/auth-service";
import { useAuth } from "@/hooks/use-auth";

function userInitials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    authService.me()
      .then((current) => { if (active) updateUser(current); })
      .catch(() => undefined);
    return () => { active = false; };
  }, [updateUser]);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone ?? "");
  }, [user]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (name.trim().length < 3) { setError("El nombre debe tener al menos 3 caracteres."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError("Introduce un correo electrónico válido."); return; }
    setSaving(true);
    try {
      updateUser(await authService.updateProfile({ name: name.trim(), email: email.trim(), phone: phone.trim() || null }));
      setNotice("Perfil actualizado correctamente.");
    } catch (reason: unknown) {
      setError(reason instanceof ApiError ? reason.message : "No se pudo actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  }

  return <PrivatePage><main className="auth-page"><section className="auth-panel">
    <p className="section-label">CUENTA</p><h1>Mi perfil</h1><p>Actualiza tus datos personales. Tu rol no puede modificarse desde aquí.</p>
    <div className="profile-avatar" aria-hidden="true"><span>{userInitials(user?.name ?? name)}</span></div>
    <form onSubmit={submit}>
      <div className="form-group"><label htmlFor="profile-name">Nombre</label><input className="field" id="profile-name" value={name} onChange={(event) => setName(event.target.value)} disabled={saving} /></div>
      <div className="form-group"><label htmlFor="profile-email">Correo electrónico</label><input className="field" id="profile-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={saving} /></div>
      <div className="form-group"><label htmlFor="profile-phone">Teléfono (opcional)</label><input className="field" id="profile-phone" value={phone} onChange={(event) => setPhone(event.target.value)} disabled={saving} /></div>
      {error && <p className="error-message" role="alert">{error}</p>}
      {notice && <p id="form-message" role="status">{notice}</p>}
      <button className="button primary-button" type="submit" disabled={saving}>{saving ? "Guardando..." : "Guardar cambios"}</button>
    </form>
  </section></main></PrivatePage>;
}
