"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth-service";
import { ApiError } from "@/services/http-client";
import { validateAuth, hasErrors, type FieldErrors } from "@/domain/validation";
import { useAuth } from "@/hooks/use-auth";

export default function RegisterPage() {
  const router = useRouter(); const { login } = useAuth();
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({}); const [message, setMessage] = useState(""); const [saving, setSaving] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const nextErrors = validateAuth({ name, email, password }, true); setErrors(nextErrors); setMessage("");
    if (hasErrors(nextErrors)) return; setSaving(true);
    try { await authService.register({ name: name.trim(), email: email.trim(), password }); const session = await authService.login({ email: email.trim(), password }); login(session); router.push("/"); }
    catch (reason: unknown) { setMessage(reason instanceof ApiError ? reason.message : "No se pudo completar el registro."); }
    finally { setSaving(false); }
  }
  return <main className="auth-page"><section className="auth-panel"><p className="section-label">ÚNETE A VENTEK</p><h1>Crea tu cuenta</h1><p>Regístrate para solicitar servicios y consultar tus solicitudes.</p><form id="service-form" onSubmit={submit}>
    <div className="form-group"><label htmlFor="name">Nombre</label><input id="name" value={name} onChange={(e) => setName(e.target.value)} className="field" aria-invalid={Boolean(errors.name)} />{errors.name && <span className="error-message">{errors.name}</span>}</div>
    <div className="form-group"><label htmlFor="email">Correo electrónico</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" aria-invalid={Boolean(errors.email)} />{errors.email && <span className="error-message">{errors.email}</span>}</div>
    <div className="form-group"><label htmlFor="password">Contraseña</label><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="field" aria-invalid={Boolean(errors.password)} />{errors.password && <span className="error-message">{errors.password}</span>}</div>
    {message && <p id="form-message" role="alert">{message}</p>}<button type="submit" className="button primary-button" disabled={saving}>{saving ? "Creando cuenta..." : "Crear cuenta"}</button>
  </form><p className="auth-link">¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link></p></section></main>;
}
