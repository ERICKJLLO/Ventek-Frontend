"use client";

import { useEffect, useState } from "react";
import type { Service } from "@/domain/types";
import { serviceService } from "@/services/service-service";
import { ApiError } from "@/services/http-client";
import { ErrorState, LoadingState } from "./LoadingState";

export function ServiceCatalog({ onSelect }: { onSelect?: (service: Service) => void }) {
  const [services, setServices] = useState<Service[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    serviceService.list(page).then((response) => {
      if (!active) return;
      setServices(response.data);
      setTotalPages(response.pagination.totalPages);
      setError("");
    }).catch((reason: unknown) => {
      if (!active) return;
      setError(reason instanceof ApiError ? reason.message : "No se pudo cargar el catálogo.");
    }).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [page]);

  return (
    <div>
      {loading && <LoadingState label="Cargando servicios..." />}
      {!loading && error && <ErrorState message={error} />}
      {!loading && !error && services.length === 0 && <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">Aún no hay servicios disponibles.</p>}
      {!loading && !error && services.length > 0 && (
        <>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service.id} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-[#0d0d0f]">
                <div className="h-2 bg-gradient-to-r from-accent-dark to-accent" />
                <div className="flex flex-1 flex-col p-6">
                <span className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-accent-dark">{service.category}</span>
                <h3 className="text-xl font-bold text-ink">{service.name}</h3>
                <p className="mt-3 flex-1 leading-7 text-slate-600">{service.description}</p>
                {onSelect && <button onClick={() => onSelect(service)} className="mt-6 self-start font-semibold text-accent-dark hover:text-ink dark:hover:text-white">Solicitar servicio →</button>}
                </div>
              </article>
            ))}
          </div>
          {totalPages > 1 && <div className="mt-8 flex items-center justify-center gap-4">
            <button disabled={page === 1} onClick={() => setPage((current) => current - 1)} className="rounded-full border border-slate-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40">Anterior</button>
            <span className="text-sm text-slate-500">Página {page} de {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-full border border-slate-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40">Siguiente</button>
          </div>}
        </>
      )}
    </div>
  );
}
