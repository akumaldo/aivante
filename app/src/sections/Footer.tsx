export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-white/5">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo/Brand */}
          <a href="#hero" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img
              src="/og-image.png"
              alt="AIPF"
              className="h-9 w-9"
            />
            <span className="text-white font-bold text-lg tracking-wide">AIPF</span>
          </a>

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
              href="mailto:contato@aipf.com.br"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Contato
            </a>
            <a
              href="https://linkedin.com/company/aipf"
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
              Fale conosco
            </a>
          </nav>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-slate-500 text-sm">
            © {currentYear} AIPF — AI Performance Framework. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
