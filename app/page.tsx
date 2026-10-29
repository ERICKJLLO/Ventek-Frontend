"use client";

import Link from "next/link";
import { useState } from "react";
import type { Service } from "@/domain/types";
import { useAuth } from "@/hooks/use-auth";
import { ServiceCatalog } from "@/components/ServiceCatalog";
import { InteractionForm } from "@/components/InteractionForm";

export default function HomePage() {
  const { user, isReady } = useAuth();
  const [selected, setSelected] = useState<Service>();
  return <main>
    <section id="inicio"><div className="hero-content">
      <p className="hero-label">SOLUCIONES TECNOLÓGICAS</p>
      <h1>Tecnología que impulsa tus ideas.</h1>
      <p className="hero-description">Desarrollo web, mantenimiento y optimización tecnológica para personas, emprendimientos y pequeños negocios.</p>
      <div className="hero-buttons"><Link href="#servicios" className="button primary-button">Ver servicios</Link><Link href="#contacto" className="button secondary-button">Solicitar servicio</Link></div>
    </div></section>
    <section id="servicios">
      <div className="section-header"><p className="section-label">LO QUE HACEMOS</p><h2>Servicios para tus necesidades tecnológicas.</h2><p>Encuentra soluciones de desarrollo web y soporte para mejorar tus proyectos y equipos.</p></div>
      <ServiceCatalog onSelect={setSelected} />
    </section>
    <section id="proceso">
      <div className="section-header"><p className="section-label">CÓMO TRABAJAMOS</p><h2>Un proceso claro para cada proyecto.</h2><p>Trabajamos de forma organizada para entender lo que necesitas y entregar una solución adecuada.</p></div>
      <div className="process-container">
        <article className="process-step"><span>01</span><h3>Cuéntanos qué necesitas</h3><p>Explícanos tu proyecto, idea o el problema que necesitas solucionar.</p></article>
        <article className="process-step"><span>02</span><h3>Revisamos tu solicitud</h3><p>Analizamos lo que necesitas y definimos el trabajo que se debe realizar.</p></article>
        <article className="process-step"><span>03</span><h3>Realizamos el trabajo</h3><p>Desarrollamos el proyecto o realizamos el mantenimiento de tu equipo.</p></article>
        <article className="process-step"><span>04</span><h3>Entregamos el resultado</h3><p>Finalizamos el servicio y te entregamos el resultado acordado.</p></article>
      </div>
    </section>
    <section id="nosotros"><div className="about-content">
      <div className="about-title"><p className="section-label">SOBRE VENTEK</p><h2>Tecnología pensada para ayudarte a avanzar.</h2></div>
      <div className="about-text"><p>Ventek es un proyecto enfocado en ofrecer soluciones tecnológicas prácticas y accesibles.</p><p>Combinamos desarrollo web con mantenimiento y optimización de equipos para ayudar a personas, emprendimientos y pequeños negocios a aprovechar mejor la tecnología.</p><p>Nuestro objetivo es entender cada necesidad y encontrar una solución adecuada para cada proyecto.</p></div>
    </div></section>
    <section id="contacto">
      <div className="section-header"><p className="section-label">SOLICITA TU SERVICIO</p><h2>Cuéntanos qué necesitas.</h2><p>Envíanos los detalles de tu proyecto o equipo y revisaremos tu solicitud.</p></div>
      {!isReady ? null : user ? <InteractionForm services={[]} selectedService={selected} /> : <div className="auth-prompt"><p>Para enviar una solicitud debes iniciar sesión.</p><Link href="/login" className="button primary-button">Iniciar sesión</Link></div>}
    </section>
  </main>;
}
