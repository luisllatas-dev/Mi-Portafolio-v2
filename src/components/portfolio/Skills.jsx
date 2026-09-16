import RevealSection from "./RevealSection";

const CATEGORIES = [
  {
    id: "frontend",
    title: "Frontend",
    accent: "#00E5FF",
    skills: ["TypeScript", "React", "Tailwind", "HTML", "CSS"],
  },
  {
    id: "backend",
    title: "Backend",
    accent: "#00E5FF",
    skills: ["Node.js", "Express"],
  },
  {
    id: "database",
    title: "Bases de Datos",
    accent: "#00E5FF",
    skills: ["MongoDB", "MySQL"],
  },
  {
    id: "ia",
    title: "Agentes IA",
    accent: "#7C3AED",
    skills: ["Claude Code","GitHub Copilot", "MCP"],
  },
  {
    id: "herramientas",
    title: "Herramientas",
    accent: "#00ff77",
    skills: ["Docker", "Vercel", "Postman", "Git", "GitHub", "Figma"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Module header */}
        <RevealSection>
          <div className="flex items-center gap-4 mb-16">
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#00E5FF]">
              02
            </span>
            <span className="h-px flex-1 max-w-[60px] bg-[#00E5FF]/40" />
            <h2 className="font-mono-tech text-xs uppercase tracking-[0.3em] text-[#64748B]">
              Skills // Tech Stack Schematic
            </h2>
          </div>
        </RevealSection>

        <RevealSection delay={0.1}>
          <h3 className="font-heading text-3xl lg:text-5xl font-bold uppercase tracking-tight text-[#F0F4F8] mb-4 max-w-3xl">
            Stack técnico <span className="text-[#00E5FF] text-glow-cyan">completo</span>
          </h3>
          <p className="text-lg text-[#64748B] max-w-2xl mb-16">
            Del frontend al despliegue — cada capa cubierta con herramientas probadas
            en producción.
          </p>
        </RevealSection>

        {/* Bento grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat, idx) => (
            <RevealSection key={cat.id} delay={0.1 * idx} className="h-full">
              <div
                className="group relative h-full p-6 rounded-xl border bg-[#08080A]/60 backdrop-blur-sm transition-all duration-300 hover:bg-[#08080A]/80"
                style={{ borderColor: `${cat.accent}20` }}
              >
                {/* Corner accents */}
                <div
                  className="absolute -top-px -left-px w-4 h-4 border-t border-l rounded-tl-xl"
                  style={{ borderColor: cat.accent }}
                />

                {/* Category title */}
                <div className="flex items-center gap-2 mb-5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: cat.accent }}
                  />
                  <h4 className="font-mono-tech text-sm uppercase tracking-wider text-[#F0F4F8]">
                    {cat.title}
                  </h4>
                </div>

                {/* Skill pills */}
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="font-mono-tech text-xs px-3 py-1.5 rounded-md border transition-all duration-300 group-hover:scale-105"
                      style={{
                        borderColor: `${cat.accent}30`,
                        color: "#94A3B8",
                        backgroundColor: `${cat.accent}08`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = cat.accent;
                        e.currentTarget.style.color = cat.accent;
                        e.currentTarget.style.boxShadow = `0 0 12px ${cat.accent}40`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = `${cat.accent}30`;
                        e.currentTarget.style.color = "#94A3B8";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* ID footer */}
                <div className="mt-5 pt-4 border-t border-[#F0F4F8]/5">
                  <span className="font-mono-tech text-[10px] text-[#64748B]">
                    {`// module_${cat.id}`}
                  </span>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}