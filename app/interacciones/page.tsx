"use client";

import { useEffect, useState } from "react";
import { PrivatePage } from "@/components/PrivatePage";
import { ErrorState, LoadingState } from "@/components/LoadingState";
import { interactionService } from "@/services/interaction-service";
import { ApiError } from "@/services/http-client";
import type { Interaction } from "@/domain/types";

export default function InteractionsPage() {
  const [items, setItems] = useState<Interaction[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { interactionService.mine().then(setItems).catch((reason: unknown) => setError(reason instanceof ApiError ? reason.message : "No se pudieron cargar tus solicitudes.")).finally(() => setLoading(false)); }, []);
  return <PrivatePage><main className="mx-auto max-w-6xl px-5 py-16"><p className="text-sm font-bold uppercase tracking-[0.25em] text-accent-dark">Área personal</p><h1 className="mt-3 text-4xl font-black text-ink">Mis solicitudes</h1><div className="mt-10">{loading && <LoadingState />}{error && <ErrorState message={error} />}{!loading && !error && !items.length && <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">Todavía no has enviado solicitudes.</p>}{!loading && !error && items.length > 0 && <div className="space-y-4">{items.map((item) => <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap justify-between gap-3"><h2 className="font-bold text-ink">{item.service?.name ?? `Servicio #${item.serviceId}`}</h2><time className="text-sm text-slate-500">{new Date(item.createdAt).toLocaleDateString("es-MX")}</time></div><p className="mt-3 leading-7 text-slate-600">{item.message}</p></article>)}</div>}</div></main></PrivatePage>;
}
