import { useLocation } from 'react-router-dom';

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#08080A] text-[#F0F4F8]">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="font-heading text-7xl font-light text-[#00E5FF] text-glow-cyan">404</h1>
          <div className="h-0.5 w-16 bg-[#00E5FF]/40 mx-auto"></div>
        </div>

        <div className="space-y-3">
          <h2 className="font-heading text-2xl font-medium uppercase tracking-tight">
            Página no encontrada
          </h2>
          <p className="font-mono-tech text-sm text-[#94A3B8] leading-relaxed">
            La ruta <span className="text-[#00E5FF]">/{pageName}</span> no existe en este portafolio.
          </p>
        </div>

        <a
          href="/"
          className="inline-flex items-center px-6 py-3 font-mono-tech text-xs uppercase tracking-widest text-[#00E5FF] border border-[#00E5FF]/50 rounded-lg hover:bg-[#00E5FF]/10 transition-colors glow-cyan"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
}
