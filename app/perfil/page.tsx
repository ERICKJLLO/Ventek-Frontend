"use client";

import { useEffect, useState } from "react";
import { PrivatePage } from "@/components/PrivatePage";
import { ApiError } from "@/services/http-client";
import { authService } from "@/services/auth-service";
import { useAuth } from "@/hooks/use-auth";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [photoSaving, setPhotoSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone ?? "");
    authService.me().then(updateUser).catch(() => undefined);
  }, [updateUser, user]);

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

  async function selectPhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoError("");
    if (!["image/png", "image/jpeg"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setPhotoError("Selecciona una imagen PNG o JPG/JPEG de máximo 5 MB.");
      event.target.value = "";
      return;
    }
    setSelectedPhoto(file);
    setPreview(URL.createObjectURL(file));
    event.target.value = "";
  }

  async function savePhoto() {
    if (!selectedPhoto) return;
    setPhotoSaving(true);
    try {
      updateUser(await authService.uploadAvatar(selectedPhoto));
      setNotice("Foto de perfil actualizada correctamente.");
      setSelectedPhoto(null);
      setPreview(null);
    } catch (reason: unknown) {
      setPhotoError(reason instanceof ApiError ? reason.message : "No se pudo guardar la foto de perfil.");
    } finally {
      setPhotoSaving(false);
    }
  }

  function cancelPhoto() {
    setSelectedPhoto(null);
    setPreview(null);
    setPhotoError("");
  }

  async function removePhoto() {
    setPhotoError("");
    setPhotoSaving(true);
    try {
      updateUser(await authService.removeAvatar());
      setNotice("Foto de perfil eliminada.");
    } catch (reason: unknown) {
      setPhotoError(reason instanceof ApiError ? reason.message : "No se pudo eliminar la foto de perfil.");
    } finally {
      setPhotoSaving(false);
    }
  }

  return <PrivatePage><main className="auth-page"><section className="auth-panel">
    <p className="section-label">CUENTA</p><h1>Mi perfil</h1><p>Actualiza tus datos personales. Tu rol no puede modificarse desde aquí.</p>
    <div className="profile-photo-section">
      <p className="form-group-label">Foto de perfil</p>
      <div className="profile-photo-preview">
        {(preview || user?.profileImageUrl) ? <img src={preview ?? user?.profileImageUrl ?? ""} alt="Vista previa de perfil" /> : <span>{user?.name.slice(0, 2).toUpperCase()}</span>}
      </div>
      <label className="button secondary-button" htmlFor="profile-photo">{selectedPhoto ? "Cambiar selección" : "Subir foto"}</label>
      <input id="profile-photo" type="file" accept="image/png,image/jpeg" onChange={selectPhoto} disabled={photoSaving} hidden />
      {selectedPhoto && <><button className="button primary-button" type="button" onClick={savePhoto} disabled={photoSaving}>{photoSaving ? "Guardando..." : "Guardar foto"}</button><button className="button secondary-button" type="button" onClick={cancelPhoto} disabled={photoSaving}>Cancelar</button></>}
      {!selectedPhoto && user?.profileImageUrl && <button className="button secondary-button" type="button" onClick={removePhoto} disabled={photoSaving}>Quitar foto</button>}
      {photoError && <p className="error-message" role="alert">{photoError}</p>}
    </div>
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
