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
  return <main className="mx-auto max-w-md px-5 py-20"><div className="mb-8"><p className="text-sm font-bold uppercase tracking-[0.25em] text-accent-dark">Únete a Ventek</p><h1 className="mt-3 text-4xl font-black text-ink">Crea tu cuenta</h1></div><form onSubmit={submit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div><label htmlFor="name" className="mb-2 block text-sm font-semibold">Nombre</label><input id="name" value={name} onChange={(e) => setName(e.target.value)} className="field" aria-invalid={Boolean(errors.name)} />{errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}</div>
    <div><label htmlFor="email" className="mb-2 block text-sm font-semibold">Correo electrónico</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" aria-invalid={Boolean(errors.email)} />{errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}</div>
    <div><label htmlFor="password" className="mb-2 block text-sm font-semibold">Contraseña</label><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="field" aria-invalid={Boolean(errors.password)} />{errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}</div>
    {message && <p role="alert" className="text-sm text-red-600">{message}</p>}<button disabled={saving} className="w-full rounded-full bg-ink px-5 py-3 font-semibold text-white hover:bg-slate-700 disabled:opacity-50">{saving ? "Creando cuenta..." : "Crear cuenta"}</button>
  </form><p className="mt-6 text-center text-sm text-slate-600">¿Ya tienes cuenta? <Link href="/login" className="font-bold text-accent-dark">Inicia sesión</Link></p></main>;
}
