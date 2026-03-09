export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-warm-border">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo/Brand */}
          <a href="#hero" className="hover:opacity-80 transition-opacity">
            <img
              src="/logo-full.png"
              alt="AIPF — Integração e Performance"
              className="h-16"
            />
          </a>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <a
              href="#solution"
              className="text-text-secondary hover:text-gold transition-colors"
            >
              Solução
            </a>
            <a
              href="#insights"
              className="text-text-secondary hover:text-gold transition-colors"
            >
              Insights
            </a>
            <a
              href="mailto:contato@aipf.com.br"
              className="text-text-secondary hover:text-gold transition-colors"
            >
              Contato
            </a>
            <a
              href="#cta"
              className="text-text-secondary hover:text-gold transition-colors"
            >
              Fale conosco
            </a>
          </nav>
        </div>

        <div className="mt-8 pt-8 border-t border-warm-border text-center">
          <p className="text-text-muted text-sm">
            © {currentYear} AIPF — Integração e Performance. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
