"use client";

import { useEffect, useMemo, useState } from "react";
import type { Service } from "@/domain/types";
import { serviceService } from "@/services/service-service";
import { ApiError } from "@/services/http-client";
import { ErrorState, LoadingState } from "./LoadingState";

const imageByService: Record<string, string> = {
  "Página web para negocio": "/assets/images/services/pagina-web.jpg",
  "Landing page": "/assets/images/services/landing-page.jpg",
  "Portafolio digital": "/assets/images/services/portafolio.jpg",
  "Aplicación web": "/assets/images/services/aplicacion-web.jpg",
  "Mantenimiento de PC": "/assets/images/services/mantenimiento-pc.jpg",
  "Mantenimiento de laptop": "/assets/images/services/mantenimiento-laptop.jpg",
  "Mantenimiento de consola": "/assets/images/services/mantenimiento-consola.jpg",
  "Cambio de pasta térmica": "/assets/images/services/pasta-termica.jpg",
  "Optimización de equipos": "/assets/images/services/optimizacion.jpg",
};

function categoryName(category: string) {
  return category.toLowerCase().includes("desarrollo") ? "Desarrollo web" : "Soporte tecnológico";
}

export function ServiceCatalog({ onSelect }: { onSelect?: (service: Service) => void }) {
  const [services, setServices] = useState<Service[]>([]);
  const [filter, setFilter] = useState("todos");
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

  const visibleServices = useMemo(() => services.filter((service) => filter === "todos" || (filter === "desarrollo-web" ? categoryName(service.category) === "Desarrollo web" : categoryName(service.category) === "Soporte tecnológico")), [filter, services]);

  function selectService(service: Service) {
    onSelect?.(service);
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <div className="service-filters">
        {[["todos", "Todos"], ["desarrollo-web", "Desarrollo web"], ["soporte", "Soporte tecnológico"]].map(([value, label]) => <button key={value} type="button" className={`filter-button${filter === value ? " active" : ""}`} onClick={() => setFilter(value)}>{label}</button>)}
      </div>
      {loading && <LoadingState label="Cargando servicios..." />}
      {!loading && error && <ErrorState message={error} />}
      {!loading && !error && visibleServices.length === 0 && <p className="empty-state">Aún no hay servicios disponibles.</p>}
      {!loading && !error && visibleServices.length > 0 && (
        <>
          <div id="services-container">
            {visibleServices.map((service) => <article key={service.id} className="service-card" tabIndex={0} role="button" aria-label={`Solicitar ${service.name}`} onClick={() => selectService(service)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectService(service); } }}>
              <img className="service-card-image" src={imageByService[service.name] ?? "/assets/images/general/desktop.png"} alt={service.name} />
              <div className="service-card-content">
                <span className="service-card-category">{categoryName(service.category)}</span>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <button className="service-card-button" type="button" onClick={(event) => { event.stopPropagation(); selectService(service); }}>Solicitar servicio</button>
              </div>
            </article>)}
          </div>
          {totalPages > 1 && <div className="pagination"><button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Anterior</button><span>Página {page} de {totalPages}</span><button type="button" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)}>Siguiente</button></div>}
        </>
      )}
    </>
  );
}
