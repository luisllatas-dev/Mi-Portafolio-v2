import { useRef, useState, useMemo } from "react";
import { ArrowRight, Mail, Cpu } from "lucide-react";

const HERO_BG = "https://media.db.com/images/public/6a4b1480b3327a3250b08be8/50244b670_generated_image.png";

// Neural node grid positions (percentage based)
const NODES = [
{ x: 15, y: 20, c: true }, { x: 40, y: 15, c: false }, { x: 70, y: 25, c: true },
{ x: 85, y: 50, c: false }, { x: 65, y: 70, c: true }, { x: 30, y: 60, c: false },
{ x: 50, y: 45, c: true }, { x: 20, y: 80, c: false }, { x: 75, y: 85, c: true },
{ x: 45, y: 80, c: false }, { x: 10, y: 50, c: true }, { x: 90, y: 20, c: false }];

const CONNECTIONS = [
[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
[6, 0], [6, 1], [6, 3], [6, 4], [6, 5],
[7, 5], [8, 4], [9, 7], [10, 0], [11, 2], [9, 8]];

export default function Hero() {
  const containerRef = useRef(null);
  const [mouse, setMouse] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const nodePositions = useMemo(() => {
    if (!containerRef.current) return NODES.map(() => ({ active: false }));
    const rect = containerRef.current.getBoundingClientRect();
    return NODES.map((n) => {
      const nx = n.x / 100 * rect.width;
      const ny = n.y / 100 * rect.height;
      const dist = Math.hypot(nx - mouse.x, ny - mouse.y);
      return { active: dist < 140 };
    });
  }, [mouse]);

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center overflow-hidden circuit-grid">

      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_BG}
          alt=""
          className="w-full h-full object-cover opacity-25" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#08080A] via-[#08080A]/90 to-[#08080A]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-transparent to-[#08080A]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full grid lg:grid-cols-12 gap-8 items-center pt-20">
        {/* Left — Terminal */}
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            <span className="font-mono-tech text-xs uppercase tracking-[0.3em] text-[#64748B]">
              Sistema en línea · Chiclayo, PE
            </span>
          </div>

          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold uppercase tracking-tight leading-[0.95] text-[#F0F4F8]">
            Full Stack
            <br />
            <span className="text-[#00E5FF] text-glow-cyan">Developer</span>
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-[#00E5FF] to-transparent" />
            <span className="font-mono-tech text-sm uppercase tracking-widest text-[#00E5FF] text-glow-cyan">FULL STACK & AI

            </span>
          </div>

          <p className="mt-8 text-lg lg:text-xl text-[#94A3B8] max-w-xl leading-relaxed">
            Creación de aplicaciones web modernas, interfaces eficientes e integración de APIs RESTful orientadas a resolver
            necesidades de negocio.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#proyectos"
              className="group relative inline-flex items-center gap-2 px-7 py-4 border border-[#00E5FF]/60 rounded-lg font-mono-tech text-sm uppercase tracking-wider text-[#00E5FF] hover:bg-[#00E5FF]/10 hover:border-[#00E5FF] transition-all duration-300 glow-cyan">

              Ver Proyectos
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contacto"
              className="group inline-flex items-center gap-2 px-7 py-4 bg-[#7C3AED] rounded-lg font-mono-tech text-sm uppercase tracking-wider text-white hover:bg-[#6D28D9] transition-all duration-300 glow-violet">

              <Mail size={16} />
              Contactar
            </a>
          </div>

          {/* Quick stats */}
          <div className="mt-12 flex gap-10">
            {[
            { val: "4+", label: "Proyectos clave" },
            { val: "15+", label: "Tecnologías" },
            { val: "4", label: "Certificaciones" }].
            map((s) =>
            <div key={s.label}>
                <div className="font-heading text-2xl font-bold text-[#00E5FF] text-glow-cyan">
                  {s.val}
                </div>
                <div className="font-mono-tech text-xs uppercase tracking-wider text-[#64748B] mt-1">
                  {s.label}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right — Neural Core */}
        <div className="lg:col-span-5 hidden lg:flex items-center justify-center relative h-[480px]">
          <div className="relative w-full h-full">
            {/* SVG connections */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              {CONNECTIONS.map(([a, b], i) => {
                const na = NODES[a];
                const nb = NODES[b];
                return (
                  <line
                    key={i}
                    x1={`${na.x}%`}
                    y1={`${na.y}%`}
                    x2={`${nb.x}%`}
                    y2={`${nb.y}%`}
                    stroke={na.c ? "#00E5FF" : "#7C3AED"}
                    strokeWidth="1"
                    opacity="0.15" />);

              })}
            </svg>

            {/* Nodes */}
            {NODES.map((node, i) =>
            <div
              key={i}
              className="absolute rounded-full transition-all duration-300"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                width: nodePositions[i]?.active ? 14 : 8,
                height: nodePositions[i]?.active ? 14 : 8,
                transform: "translate(-50%, -50%)",
                backgroundColor: node.c ? "#00E5FF" : "#7C3AED",
                boxShadow: nodePositions[i]?.active ?
                `0 0 20px ${node.c ? "rgba(0,229,255,0.8)" : "rgba(124,58,237,0.8)"}` :
                `0 0 8px ${node.c ? "rgba(0,229,255,0.3)" : "rgba(124,58,237,0.3)"}`,
                opacity: nodePositions[i]?.active ? 1 : 0.5
              }} />

            )}

            {/* Central chip icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative w-28 h-28 rounded-2xl border border-[#00E5FF]/30 bg-[#08080A]/60 backdrop-blur-sm flex items-center justify-center glow-cyan">
                <Cpu size={48} className="text-[#00E5FF]" strokeWidth={1.5} />
                <div className="absolute -top-2 -left-2 w-3 h-3 border-t border-l border-[#7C3AED]" />
                <div className="absolute -top-2 -right-2 w-3 h-3 border-t border-r border-[#7C3AED]" />
                <div className="absolute -bottom-2 -left-2 w-3 h-3 border-b border-l border-[#7C3AED]" />
                <div className="absolute -bottom-2 -right-2 w-3 h-3 border-b border-r border-[#7C3AED]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="font-mono-tech text-[10px] uppercase tracking-widest text-[#64748B]">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-[#00E5FF]/60 to-transparent" />
      </div>
    </section>);

}
