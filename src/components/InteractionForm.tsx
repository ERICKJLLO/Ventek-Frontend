"use client";

import { useEffect, useState } from "react";
import type { Service } from "@/domain/types";
import { interactionService } from "@/services/interaction-service";
import { serviceService } from "@/services/service-service";
import { ApiError } from "@/services/http-client";

export function InteractionForm({ services: initialServices, selectedService, onDone }: { services?: Service[]; selectedService?: Service; onDone?: () => void }) {
  const [services, setServices] = useState(initialServices ?? []);
  const [serviceId, setServiceId] = useState(String(selectedService?.id ?? ""));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setServices(initialServices ?? []);
    if (initialServices?.length) return;
    serviceService.list(1, 100).then((response) => setServices(response.data)).catch((reason: unknown) => setError(reason instanceof ApiError ? reason.message : "No se pudieron cargar los servicios."));
  }, [initialServices]);

  useEffect(() => {
    if (selectedService) setServiceId(String(selectedService.id));
  }, [selectedService]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!serviceId || !message.trim()) { setError("Selecciona un servicio y escribe tu mensaje."); return; }
    setSaving(true); setError(""); setSuccess("");
    try {
      await interactionService.create({ serviceId: Number(serviceId), message: message.trim() });
      setMessage(""); setSuccess("Tu solicitud fue enviada correctamente."); onDone?.();
    } catch (reason: unknown) {
      setError(reason instanceof ApiError ? reason.message : "No se pudo enviar la solicitud.");
    } finally { setSaving(false); }
  }

  return <form onSubmit={submit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div><label htmlFor="interaction-service" className="mb-2 block text-sm font-semibold text-ink">Servicio</label>
      <select id="interaction-service" value={serviceId} onChange={(event) => setServiceId(event.target.value)} className="field" disabled={saving}>
        <option value="">Selecciona un servicio</option>{services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
      </select>
    </div>
    <div><label htmlFor="interaction-message" className="mb-2 block text-sm font-semibold text-ink">Cuéntanos qué necesitas</label>
      <textarea id="interaction-message" value={message} onChange={(event) => setMessage(event.target.value)} rows={5} className="field resize-y" placeholder="Describe brevemente tu proyecto o equipo." disabled={saving} />
    </div>
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    {success && <p role="status" className="text-sm text-green-700">{success}</p>}
    <button disabled={saving} className="w-full rounded-full bg-ink px-5 py-3 font-semibold text-white hover:bg-slate-700 disabled:opacity-50">{saving ? "Enviando..." : "Enviar solicitud"}</button>
  </form>;
}
