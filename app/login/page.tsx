"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth-service";
import { ApiError } from "@/services/http-client";
import { validateAuth, hasErrors, type FieldErrors } from "@/domain/validation";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({}); const [message, setMessage] = useState(""); const [saving, setSaving] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const nextErrors = validateAuth({ email, password }, false); setErrors(nextErrors); setMessage("");
    if (hasErrors(nextErrors)) return; setSaving(true);
    try { const session = await authService.login({ email: email.trim(), password }); login(session); router.push("/"); }
    catch (reason: unknown) { setMessage(reason instanceof ApiError ? reason.message : "No se pudo iniciar sesión."); }
    finally { setSaving(false); }
  }
  return <main className="mx-auto max-w-md px-5 py-20"><div className="mb-8"><p className="text-sm font-bold uppercase tracking-[0.25em] text-accent-dark">Bienvenido</p><h1 className="mt-3 text-4xl font-black text-ink">Inicia sesión</h1><p className="mt-3 text-slate-600">Accede para solicitar servicios y consultar tus solicitudes.</p></div><form onSubmit={submit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div><label htmlFor="email" className="mb-2 block text-sm font-semibold">Correo electrónico</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" aria-invalid={Boolean(errors.email)} />{errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}</div>
    <div><label htmlFor="password" className="mb-2 block text-sm font-semibold">Contraseña</label><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="field" aria-invalid={Boolean(errors.password)} />{errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}</div>
    {message && <p role="alert" className="text-sm text-red-600">{message}</p>}<button disabled={saving} className="w-full rounded-full bg-ink px-5 py-3 font-semibold text-white hover:bg-slate-700 disabled:opacity-50">{saving ? "Ingresando..." : "Iniciar sesión"}</button>
  </form><p className="mt-6 text-center text-sm text-slate-600">¿Aún no tienes cuenta? <Link href="/registro" className="font-bold text-accent-dark">Regístrate</Link></p></main>;
}
