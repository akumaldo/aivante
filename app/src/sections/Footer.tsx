import { Sparkles, BarChart3 } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-white/5">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <span className="text-white font-semibold block">AIVANTE</span>
              <span className="text-xs text-slate-500">Entendimento → Piloto → Escala</span>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <a
              href="#framework"
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              Framework
            </a>
            <a
              href="#services"
              className="text-slate-400 hover:text-violet-400 transition-colors"
            >
              Como funciona
            </a>
            <a
              href="mailto:contato@aivante.com.br"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Contato
            </a>
            <a
              href="https://linkedin.com/company/aivante"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="#cta"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Contato
            </a>
          </nav>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-slate-500 text-sm">
            © {currentYear} AIVANTE. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
