import type { Metadata } from "next";
import Link from "next/link";
import { AuthProvider } from "@/hooks/use-auth";
import { Navbar } from "@/components/Navbar";
import "./globals.css";
import "./ventek-original.css";

export const metadata: Metadata = { title: "Ventek | Soluciones tecnológicas", description: "Desarrollo web, mantenimiento y optimización tecnológica para personas, emprendimientos y pequeños negocios.", icons: { icon: "/assets/icons/VENTEK%20LOGO.png" } };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body><AuthProvider><Navbar />{children}<footer>
    <div className="footer-content">
      <div className="footer-brand"><Link href="/#inicio" className="logo">VENTEK</Link><p>Soluciones tecnológicas para hacer realidad tus ideas.</p></div>
      <div className="footer-links"><h3>Enlaces</h3><Link href="/#inicio">Inicio</Link><Link href="/#servicios">Servicios</Link><Link href="/#proceso">Cómo trabajamos</Link><Link href="/#nosotros">Nosotros</Link><Link href="/#contacto">Contacto</Link></div>
      <div className="footer-services"><h3>Servicios</h3><Link href="/#servicios">Desarrollo web</Link><Link href="/#servicios">Soporte tecnológico</Link></div>
    </div>
    <div className="footer-bottom"><p>© 2026 Ventek. Todos los derechos reservados.</p></div>
  </footer></AuthProvider></body></html>;
}
