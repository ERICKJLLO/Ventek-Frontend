import type { Metadata } from "next";
import { AuthProvider } from "@/hooks/use-auth";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = { title: "Ventek | Tecnología que impulsa tus ideas", description: "Desarrollo web y soporte tecnológico para tus proyectos y equipos." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body><AuthProvider><Navbar />{children}<footer className="mt-20 border-t border-slate-200 bg-white"><div className="mx-auto max-w-6xl px-5 py-8 text-sm text-slate-500">© {new Date().getFullYear()} Ventek. Tecnología que impulsa tus ideas.</div></footer></AuthProvider></body></html>;
}
