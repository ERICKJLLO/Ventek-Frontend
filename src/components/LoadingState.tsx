export function LoadingState({ label = "Cargando..." }: { label?: string }) {
  return <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 dark:border-slate-800 dark:bg-[#0d0d0f] dark:text-slate-400">{label}</p>;
}

export function ErrorState({ message }: { message: string }) {
  return <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">{message}</p>;
}
