"use client";

import React, { useRef, useState } from "react";
import { FormspreeError, formspreeService } from "../services/formspree-service";

const serviceOptions = [
  ["pagina-web", "Página web para negocio"],
  ["landing-page", "Landing page"],
  ["portafolio", "Portafolio digital"],
  ["aplicacion-web", "Aplicación web"],
  ["mantenimiento-pc", "Mantenimiento de PC"],
  ["mantenimiento-laptop", "Mantenimiento de laptop"],
  ["mantenimiento-consola", "Mantenimiento de consola"],
  ["pasta-termica", "Cambio de pasta térmica"],
  ["optimizacion", "Optimización de equipos"],
] as const;

const clientTypes = [
  ["persona", "Persona"],
  ["emprendimiento", "Emprendimiento"],
  ["pequeno-negocio", "Pequeño negocio"],
] as const;

type FormFields = "name" | "email" | "service" | "client-type" | "description";
type FormErrors = Partial<Record<FormFields, string>>;

function validate(formData: FormData): FormErrors {
  const errors: FormErrors = {};
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const service = String(formData.get("service") ?? "");
  const clientType = String(formData.get("client-type") ?? "");
  const description = String(formData.get("description") ?? "").trim();

  if (name.length < 3) errors.name = "El nombre debe tener al menos 3 caracteres.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Introduce un correo electrónico válido.";
  if (!service) errors.service = "Selecciona un servicio.";
  if (!clientType) errors["client-type"] = "Selecciona el tipo de cliente.";
  if (description.length < 20) errors.description = "La descripción debe tener al menos 20 caracteres.";
  return errors;
}

export function FormspreeContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formMessage, setFormMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const nextErrors = validate(formData);
    setErrors(nextErrors);
    setFormMessage("");
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      await formspreeService.submit(formData);
      setSuccess(true);
    } catch (reason: unknown) {
      setFormMessage(reason instanceof FormspreeError ? reason.message : "No se pudo enviar la solicitud. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  function closeSuccess() {
    setSuccess(false);
    setFormMessage("");
    setErrors({});
    formRef.current?.reset();
  }

  return (
    <>
      <form id="service-form" ref={formRef} onSubmit={submit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input type="text" id="name" name="name" required disabled={saving} />
          <span className="error-message" role="alert">{errors.name ?? ""}</span>
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input type="email" id="email" name="email" required disabled={saving} />
          <span className="error-message" role="alert">{errors.email ?? ""}</span>
        </div>
        <div className="form-group">
          <label htmlFor="service">Servicio</label>
          <select id="service" name="service" required defaultValue="" disabled={saving}>
            <option value="">Selecciona un servicio</option>
            {serviceOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <span className="error-message" role="alert">{errors.service ?? ""}</span>
        </div>
        <div className="form-group">
          <label htmlFor="client-type">Tipo de cliente</label>
          <select id="client-type" name="client-type" required defaultValue="" disabled={saving}>
            <option value="">Selecciona una opción</option>
            {clientTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <span className="error-message" role="alert">{errors["client-type"] ?? ""}</span>
        </div>
        <div className="form-group">
          <label htmlFor="description">Cuéntanos qué necesitas</label>
          <textarea id="description" name="description" rows={6} minLength={20} required disabled={saving} />
          <span className="error-message" role="alert">{errors.description ?? ""}</span>
        </div>
        <button type="submit" className="button primary-button" disabled={saving}>
          {saving ? "Enviando..." : "Enviar solicitud"}
        </button>
        <p id="form-message" role="status" aria-live="polite">{formMessage}</p>
      </form>
      <div className="success-modal" role="dialog" aria-modal="true" aria-labelledby="success-modal-title" aria-describedby="success-modal-description" hidden={!success}>
        <div className="success-modal-content">
          <h2 id="success-modal-title">Solicitud enviada correctamente</h2>
          <p id="success-modal-description">Hemos recibido tu solicitud. Nos pondremos en contacto contigo pronto.</p>
          <button type="button" className="button primary-button" onClick={closeSuccess}>Aceptar</button>
        </div>
      </div>
    </>
  );
}
