import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import RevealSection from "./RevealSection";

const CHANNELS = [
  {
    icon: Github,
    label: "GitHub",
    handle: "/luisllatas",
    href: "https://github.com/luisllatas-dev",
    accent: "#F0F4F8",
    hoverBg: "#1a1a1a",
    hoverGlow: "rgba(240, 244, 248, 0.15)",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    handle: "/in/eduardollatas",
    href: "https://www.linkedin.com/in/eduardollatas",
    accent: "#7C3AED",
    hoverBg: "#5B21B6",
    hoverGlow: "rgba(124, 58, 237, 0.3)",
  },
  {
    icon: Mail,
    label: "Email",
    handle: "luiseduardollatas@gmail.com",
    href: "mailto:luiseduardollatas@gmail.com",
    accent: "#00E5FF",
    hoverBg: "#00B8D4",
    hoverGlow: "rgba(0, 229, 255, 0.3)",
  },
];

export default function Contact() {
  return (
    <section id="contacto" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Module header */}
        <RevealSection>
          <div className="flex items-center gap-4 mb-16">
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#00E5FF]">
              05
            </span>
            <span className="h-px flex-1 max-w-[60px] bg-[#00E5FF]/40" />
            <h2 className="font-mono-tech text-xs uppercase tracking-[0.3em] text-[#64748B]">
              Contacto // Establish Uplink
            </h2>
          </div>
        </RevealSection>

        <RevealSection delay={0.1}>
          <div className="text-center mb-16">
            <h3 className="font-heading text-4xl lg:text-6xl font-extrabold uppercase tracking-tight text-[#F0F4F8] mb-6">
              Construyamos algo
              <br />
              <span className="outlined-text">juntos</span>
            </h3>
            <p className="text-lg text-[#64748B] max-w-xl mx-auto">
              Disponible para oportunidades de desarrollo Full Stack, proyectos de IA
              y automatización. Respondo rápido.
            </p>
          </div>
        </RevealSection>

        {/* Brutalist tiles */}
        <RevealSection delay={0.2}>
          <div className="grid md:grid-cols-3 gap-4">
            {CHANNELS.map((ch) => (
              <a
                key={ch.label}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Contactar vía ${ch.label}`}
                className="group relative p-8 lg:p-10 rounded-xl border border-[#F0F4F8]/10 bg-[#08080A]/60 backdrop-blur-sm overflow-hidden transition-all duration-500"
                style={{ ["--hover-bg"]: ch.hoverBg, ["--hover-glow"]: ch.hoverGlow }}
              >
                {/* Hover fill */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ backgroundColor: ch.hoverBg }}
                />

                <div className="relative z-10 flex flex-col items-start gap-4">
                  <div className="flex items-center justify-between w-full">
                    <ch.icon
                      size={32}
                      className="text-[#F0F4F8] transition-colors"
                      strokeWidth={1.5}
                    />
                    <ArrowUpRight
                      size={20}
                      className="text-[#64748B] group-hover:text-white transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </div>
                  <div>
                    <h4 className="font-heading text-2xl font-bold uppercase tracking-tight text-[#F0F4F8] group-hover:text-white transition-colors">
                      {ch.label}
                    </h4>
                    <p className="font-mono-tech text-sm text-[#64748B] group-hover:text-white/70 mt-1 transition-colors">
                      {ch.handle}
                    </p>
                  </div>
                </div>

                {/* Glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 40px ${ch.hoverGlow}` }}
                />
              </a>
            ))}
          </div>
        </RevealSection>

        {/* Location */}
        <RevealSection delay={0.3}>
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            <span className="font-mono-tech text-sm text-[#64748B]">
              Chiclayo, Perú · Disponible para remoto
            </span>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}