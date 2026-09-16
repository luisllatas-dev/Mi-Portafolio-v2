import { Award, BookOpen, Bot, Sparkles } from "lucide-react";
import RevealSection from "./RevealSection";

const CERTS = [
  {
    icon: Award,
    title: "GitHub Foundations",
    issuer: "GitHub",
    accent: "#00E5FF",
  },
  {
    icon: BookOpen,
    title: "Intermediate SQL",
    issuer: "DataCamp",
    accent: "#7C3AED",
  },
  {
    icon: Bot,
    title: "Software Basado en Agentes",
    issuer: "Código Facilito",
    accent: "#00E5FF",
  },
  {
    icon: Sparkles,
    title: "Prompt Engineering",
    issuer: "Coursera",
    accent: "#7C3AED",
  },
];

export default function Certifications() {
  return (
    <section className="relative py-24 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Module header */}
        <RevealSection>
          <div className="flex items-center gap-4 mb-12">
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#00E5FF]">
              04
            </span>
            <span className="h-px flex-1 max-w-[60px] bg-[#00E5FF]/40" />
            <h2 className="font-mono-tech text-xs uppercase tracking-[0.3em] text-[#64748B]">
              Certificaciones // Verified Credentials
            </h2>
          </div>
        </RevealSection>

        <RevealSection delay={0.1}>
          <h3 className="font-heading text-2xl lg:text-4xl font-bold uppercase tracking-tight text-[#F0F4F8] mb-12 max-w-3xl">
            Aprendizaje <span className="text-[#00E5FF] text-glow-cyan">continuo</span>
          </h3>
        </RevealSection>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CERTS.map((c, idx) => (
            <RevealSection key={c.title} delay={0.08 * idx}>
              <div
                className="group relative p-5 rounded-xl border bg-[#08080A]/60 backdrop-blur-sm transition-all duration-300 hover:bg-[#08080A]/80"
                style={{ borderColor: `${c.accent}15` }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-all duration-300"
                  style={{ backgroundColor: `${c.accent}10`, border: `1px solid ${c.accent}30` }}
                >
                  <c.icon size={20} style={{ color: c.accent }} strokeWidth={1.5} />
                </div>
                <h4 className="font-heading text-sm font-semibold text-[#F0F4F8] leading-tight mb-1">
                  {c.title}
                </h4>
                <p className="font-mono-tech text-xs text-[#64748B]">{c.issuer}</p>

                <div
                  className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: c.accent }}
                />
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}