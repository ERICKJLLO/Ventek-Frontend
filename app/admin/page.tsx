"use client";

import { useEffect, useState } from "react";
import { PrivatePage } from "@/components/PrivatePage";
import { ErrorState, LoadingState } from "@/components/LoadingState";
import { serviceService } from "@/services/service-service";
import { ApiError } from "@/services/http-client";
import type { Service, ServiceInput } from "@/domain/types";

const emptyForm: ServiceInput = { name: "", description: "", category: "Desarrollo web" };

export default function AdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState<ServiceInput>(emptyForm);
  const [editing, setEditing] = useState<number | null>(null);
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [error, setError] = useState(""); const [notice, setNotice] = useState("");

  function load() { setLoading(true); setError(""); serviceService.list(1, 100).then((response) => setServices(response.data)).catch((reason: unknown) => setError(reason instanceof ApiError ? reason.message : "No se pudieron cargar los servicios.")).finally(() => setLoading(false)); }
  useEffect(() => { load(); }, []);
  function change(field: keyof ServiceInput, value: string) { setForm((current) => ({ ...current, [field]: value })); }
  function edit(service: Service) { setEditing(service.id); setForm({ name: service.name, description: service.description, category: service.category }); setNotice(""); setError(""); }
  function reset() { setEditing(null); setForm(emptyForm); }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setNotice("");
    if (!form.name.trim() || !form.description.trim() || !form.category.trim()) { setError("Completa todos los campos del servicio."); return; }
    setSaving(true);
    try { const wasEditing = editing !== null; if (wasEditing) await serviceService.update(editing, form); else await serviceService.create(form); reset(); setNotice(wasEditing ? "Servicio actualizado." : "Servicio creado."); load(); }
    catch (reason: unknown) { setError(reason instanceof ApiError ? reason.message : "No se pudo guardar el servicio."); }
    finally { setSaving(false); }
  }
  async function remove(service: Service) {
    if (!window.confirm(`¿Eliminar «${service.name}»? Esta acción no se puede deshacer.`)) return;
    setError(""); setNotice("");
    try { await serviceService.remove(service.id); setNotice("Servicio eliminado."); load(); }
    catch (reason: unknown) { setError(reason instanceof ApiError ? reason.message : "No se pudo eliminar el servicio."); }
  }
  return <PrivatePage adminOnly><main className="mx-auto max-w-6xl px-5 py-16"><p className="text-sm font-bold uppercase tracking-[0.25em] text-accent-dark">Administración</p><h1 className="mt-3 text-4xl font-black text-ink">Catálogo de servicios</h1><div className="mt-10 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
    <form onSubmit={submit} className="h-fit space-y-5 rounded-2xl border border-slate-200 bg-white p-6 text-ink shadow-sm dark:border-slate-800 dark:bg-[#0d0d0f] dark:text-[#f5f5f5]"><h2 className="text-xl font-bold">{editing ? "Editar servicio" : "Nuevo servicio"}</h2><div><label htmlFor="service-name" className="mb-2 block text-sm font-semibold">Nombre</label><input id="service-name" value={form.name} onChange={(e) => change("name", e.target.value)} className="field" /></div><div><label htmlFor="service-category" className="mb-2 block text-sm font-semibold">Categoría</label><select id="service-category" value={form.category} onChange={(e) => change("category", e.target.value)} className="field"><option>Desarrollo web</option><option>Soporte tecnológico</option></select></div><div><label htmlFor="service-description" className="mb-2 block text-sm font-semibold">Descripción</label><textarea id="service-description" value={form.description} onChange={(e) => change("description", e.target.value)} rows={4} className="field" /></div>{error && <ErrorState message={error} />}{notice && <p role="status" className="text-sm text-green-700">{notice}</p>}<div className="flex gap-3"><button disabled={saving} className="flex-1 rounded-full bg-ink px-5 py-3 font-semibold text-white disabled:opacity-50">{saving ? "Guardando..." : editing ? "Actualizar" : "Crear servicio"}</button>{editing && <button type="button" onClick={reset} className="rounded-full border border-slate-300 px-5 py-3 font-semibold">Cancelar</button>}</div></form>
    <section><h2 className="mb-5 text-xl font-bold">Servicios publicados</h2>{loading && <LoadingState />}{!loading && !error && !services.length && <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">No hay servicios publicados.</p>}<div className="space-y-3">{services.map((service) => <article key={service.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-ink shadow-sm dark:border-slate-800 dark:bg-[#0d0d0f] dark:text-[#f5f5f5] sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-accent-dark">{service.category}</p><h3 className="mt-1 font-bold text-ink">{service.name}</h3><p className="mt-1 text-sm text-slate-600">{service.description}</p></div><div className="flex shrink-0 gap-2"><button onClick={() => edit(service)} className="rounded-full border border-slate-300 px-3 py-2 text-sm font-semibold">Editar</button><button onClick={() => remove(service)} className="rounded-full border border-red-200 px-3 py-2 text-sm font-semibold text-red-700">Eliminar</button></div></article>)}</div></section>
  </div></main></PrivatePage>;
}
