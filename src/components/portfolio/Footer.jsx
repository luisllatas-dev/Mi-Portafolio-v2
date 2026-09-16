const SOCIALS = [
  { label: "GitHub", href: "https://github.com/luisllatas-dev" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/eduardollatas" },
  { label: "Email", href: "mailto:luiseduardollatas@gmail.com" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-[#00E5FF]/10 py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Copyright */}
        <div className="flex items-center gap-3">
          <span className="font-mono-tech text-xs text-[#00E5FF]">{"//"}</span>
          <span className="font-mono-tech text-xs text-[#64748B]">
            © {new Date().getFullYear()} Luis Llatas · Full Stack Developer
          </span>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-6">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono-tech text-xs uppercase tracking-wider text-[#64748B] hover:text-[#00E5FF] transition-colors duration-300"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom line */}
      <div className="mt-8 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="font-mono-tech text-[10px] text-[#64748B]/50 text-center">
          Built with React · Neural Systems Architecture
        </div>
      </div>
    </footer>
  );
}