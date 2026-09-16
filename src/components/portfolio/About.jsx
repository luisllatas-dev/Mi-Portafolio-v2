import { GraduationCap, Languages, Container, Database } from "lucide-react";
import RevealSection from "./RevealSection";
import AVATAR from "@/assets/perfil_render.png";

const TRAITS = [
{ icon: GraduationCap, label: "Zegel IPAE - Sistemas (Quinto Superior)\xA0", color: "#00E5FF" },
{ icon: Languages, label: "Logica de Negocio", color: "#7C3AED" },
{ icon: Database, label: "APIs Seguras y escalables", color: "#00E5FF" },
{ icon: Container, label: "Despliegue con Docker", color: "#7C3AED" }];

export default function About() {
  return (
    <section id="sobre-mi" className="relative py-24 lg:py-32 circuit-grid">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Module header */}
        <RevealSection>
          <div className="flex items-center gap-4 mb-16">
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#00E5FF]">
              01
            </span>
            <span className="h-px flex-1 max-w-[60px] bg-[#00E5FF]/40" />
            <h2 className="font-mono-tech text-xs uppercase tracking-[0.3em] text-[#64748B]">
              Sobre Mí // About Module
            </h2>
          </div>
        </RevealSection>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left — Avatar */}
          <RevealSection className="lg:col-span-5" delay={0.1}>
            <div className="relative">
              <div className="absolute inset-0 border border-[#00E5FF]/15 rounded-2xl" />
              <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-[#00E5FF]" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-[#7C3AED]" />
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#08080A] border border-[#00E5FF]/20">
                <img
                  src={AVATAR}
                  alt="Representación visual de Luis Llatas"
                  className="w-full h-full object-cover opacity-90" />

                <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 font-mono-tech text-xs text-[#00E5FF]">
                  {"// usr_profile.render()"}
                </div>
              </div>
            </div>
          </RevealSection>

          {/* Right — Text */}
          <RevealSection className="lg:col-span-7" delay={0.2}>
            <h3 className="font-heading text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[#F0F4F8] mb-8">
              Luis Eduardo
              <br />
              <span className="text-[#00E5FF] text-glow-cyan">Llatas Mundaca</span>
            </h3>

            <p className="text-lg text-[#94A3B8] leading-relaxed mb-6">
              Desarrollador Web Full Stack con experiencia construyendo aplicaciones dinámicas, interfaces responsivas e integración
              de APIs RESTful. Cuento con formación en Gestión de Sistemas de Información y trayectoria previa en consultoría
              comercial, lo que me permite comprender rápidamente la lógica operativa de las empresas y traducirla en módulos
              web eficientes.
            </p>
            <p className="text-lg text-[#94A3B8] leading-relaxed mb-10">
              Trabajo en el desarrollo de soluciones web completas: estructuración semántica en HTML5 y CSS3/Tailwind, lógica
              frontend con JavaScript/TypeScript y React, consumo e integración de servicios REST, y persistencia en bases de datos
              SQL relacionales. Enfoque metódico en buenas prácticas de código, control de versiones con Git y rápida adaptabilidad
              a nuevas plataformas y ecosistemas empresariales.
            </p>

            {/* Traits grid */}
            <div className="grid grid-cols-2 gap-4">
              {TRAITS.map((t) =>
              <div
                key={t.label}
                className="flex items-center gap-3 p-4 rounded-lg border border-[#F0F4F8]/5 bg-[#08080A]/50 hover:border-[#00E5FF]/30 transition-colors duration-300">

                  <t.icon size={20} style={{ color: t.color }} strokeWidth={1.5} />
                  <span className="font-mono-tech text-xs text-[#94A3B8]">{t.label}</span>
                </div>
              )}
            </div>
          </RevealSection>
        </div>
      </div>
    </section>);

}
