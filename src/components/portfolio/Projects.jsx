import { ExternalLink } from "lucide-react";
import RevealSection from "./RevealSection";

const PROJECTS = [
  {
    id: "soporte",
    num: "01",
    title: "Sistema de Soporte Técnico Empresarial",
    description:
    "Lideré y desarrollé este proyecto para gestionar el ciclo de vida de tickets de soporte técnico: creación, asignación, seguimiento de estados, observaciones, control de usuarios y notificaciones",
    tech: ["Java", "Spring Boot", "MySQL"],
    image: "src/assets/Gestion_solicitudes.png",
    accent: "#00E5FF",
    glitch: true,
    tag: "SYSTEM_SUPPORT",
  },
  {
    id: "barberia",
    num: "02",
    title: "MVP Barberia",
    description:
      "Sistema full-stack de reservas para barbería con web pública y panel de gestión. Los clientes se registran, eligen servicio, barbero y hueco libre; el admin gestiona citas, catálogo, horarios y usuarios desde un dashboard con KPIs, gráficos y exportación CSV.",
    tech: ["TypeScript", "Next.js", "React", "Tailwind", "SQLite"],
    image: "src/assets/barberia.png",
    accent: "#7C3AED",
    glitch: false,
    tag: "MVP_PROJECT",
  },
  {
    id: "vet",
    num: "03",
    title: "Sistema de Reservas de Restaurant",
    description:
      "Interfaz de usuario completa para la gestión de citas de restaurantes. UI/UX intuitiva que simplifica el agendamiento de citas, seguimiento de mesas y estados.",
    tech: ["JavaScript","React", "Tailwind"],
    image: "src/assets/restaurant.png",
    accent: "#00E5FF",
    glitch: false,
    tag: "FRONTEND_FULL",
  },
  {
    id: "pos",
    num: "04",
    title: "Sistema de Punto de Venta",
    description:
      "POS local para minimarket: inventario con código de barras y stock mínimo, caja con carrito y cobro en efectivo, tickets imprimibles e informes diarios de ventas.",
    tech: ["TypeScript","React", "Node.js", "Express", "SQLite"],
    image: "src/assets/POs.png",
    accent: "#7C3AED",
    glitch: false,
    tag: "SYSTEM_POS",
  },
];

export default function Projects() {
  return (
    <section id="proyectos" className="relative py-24 lg:py-32 circuit-grid">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Module header */}
        <RevealSection>
          <div className="flex items-center gap-4 mb-16">
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#00E5FF]">
              03
            </span>
            <span className="h-px flex-1 max-w-[60px] bg-[#00E5FF]/40" />
            <h2 className="font-mono-tech text-xs uppercase tracking-[0.3em] text-[#64748B]">
              Proyectos // Mission Logs
            </h2>
          </div>
        </RevealSection>

        <RevealSection delay={0.1}>
          <h3 className="font-heading text-3xl lg:text-5xl font-bold uppercase tracking-tight text-[#F0F4F8] mb-4 max-w-3xl">
            Problemas complejos,
            <br />
            <span className="text-[#00E5FF] text-glow-cyan">soluciones reales</span>
          </h3>
          <p className="text-lg text-[#64748B] max-w-2xl mb-16">
            Cuatro proyectos que demuestran capacidad analítica y técnica de extremo a extremo.
          </p>
        </RevealSection>

        {/* Project grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {PROJECTS.map((p, idx) => (
            <RevealSection key={p.id} delay={0.1 * idx}>
              <article
                className={`group relative rounded-xl overflow-hidden border border-[#F0F4F8]/10 bg-[#08080A]/60 backdrop-blur-sm transition-all duration-500 ${
                  p.glitch ? "glitch-hover" : ""
                }`}
                aria-describedby={`desc-${p.id}`}
              >
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] overflow-hidden scanlines">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/40 to-transparent z-[2]" />

                  {/* Project number */}
                  <div className="absolute top-4 left-4 z-[3]">
                    <span
                      className="font-heading text-5xl font-extrabold leading-none"
                      style={{ color: p.accent, opacity: 0.3 }}
                    >
                      {p.num}
                    </span>
                  </div>

                  {/* Status tag */}
                  <div className="absolute top-4 right-4 z-[3]">
                    <span
                      className="font-mono-tech text-[10px] uppercase tracking-widest px-2 py-1 rounded border"
                      style={{
                        borderColor: `${p.accent}40`,
                        color: p.accent,
                        backgroundColor: `${p.accent}10`,
                      }}
                    >
                      {p.tag}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 lg:p-7">
                  <h4
                    id={`desc-${p.id}`}
                    className="font-heading text-xl lg:text-2xl font-bold text-[#F0F4F8] mb-3 group-hover:text-[#00E5FF] transition-colors duration-300"
                  >
                    {p.title}
                  </h4>
                  <p className="text-[#94A3B8] leading-relaxed mb-5 text-[15px]">
                    {p.description}
                  </p>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-2">
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        className="font-mono-tech text-xs text-[#64748B]"
                      >
                        <span style={{ color: p.accent }}>{"//"}</span> {t}
                      </span>
                    ))}
                  </div>

                  {/* View link */}
                  <div className="mt-5 pt-4 border-t border-[#F0F4F8]/5">
                    <a
                      href="#contacto"
                      className="inline-flex items-center gap-1.5 font-mono-tech text-xs uppercase tracking-wider text-[#64748B] hover:text-[#00E5FF] transition-colors duration-300"
                    >
                      Solicitar detalles
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                {/* Glow border on hover */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 30px ${p.accent}15` }}
                />
              </article>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}