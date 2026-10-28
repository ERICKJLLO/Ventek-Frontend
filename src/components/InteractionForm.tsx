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
    if (!serviceId) { setError("Selecciona un servicio."); return; }
    if (message.trim().length < 20) { setError("La descripción debe tener al menos 20 caracteres."); return; }
    setSaving(true); setError(""); setSuccess("");
    try {
      await interactionService.create({ serviceId: Number(serviceId), message: message.trim() });
      setMessage(""); setSuccess("Solicitud enviada correctamente."); onDone?.();
    } catch (reason: unknown) {
      setError(reason instanceof ApiError ? reason.message : "No se pudo enviar la solicitud.");
    } finally { setSaving(false); }
  }

  return <form id="service-form" onSubmit={submit}>
    <div className="form-group"><label htmlFor="service">Servicio</label><select id="service" value={serviceId} onChange={(event) => setServiceId(event.target.value)} disabled={saving}><option value="">Selecciona un servicio</option>{services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}</select><span className="error-message" role="alert">{error && (!serviceId || message.trim().length < 20) ? error : ""}</span></div>
    <div className="form-group"><label htmlFor="description">Cuéntanos qué necesitas</label><textarea id="description" value={message} onChange={(event) => setMessage(event.target.value)} rows={6} minLength={20} required placeholder="Describe tu proyecto, idea o el problema que necesitas solucionar." disabled={saving} /><span className="error-message" role="alert">{error && message.trim().length < 20 ? error : ""}</span></div>
    <button type="submit" className="button primary-button" disabled={saving}>{saving ? "Enviando..." : "Enviar solicitud"}</button>
    <p id="form-message" role="status" aria-live="polite">{success || (error && serviceId && message.trim().length >= 20 ? error : "")}</p>
  </form>;
}
