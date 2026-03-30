import { scrollToSection } from '@/lib/utils';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <button
            onClick={() => scrollToSection('hero')}
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src="/logo-full.png"
              alt="AINOVA"
              className="h-14"
            />
          </button>

          <nav className="flex flex-wrap items-center gap-8 text-sm">
            <button
              onClick={() => scrollToSection('solution')}
              className="text-text-secondary hover:text-gold transition-colors"
            >
              Solução
            </button>
            <button
              onClick={() => scrollToSection('use-cases')}
              className="text-text-secondary hover:text-gold transition-colors"
            >
              Aplicações
            </button>
            <button
              onClick={() => scrollToSection('insights')}
              className="text-text-secondary hover:text-gold transition-colors"
            >
              Insights
            </button>
            <a
              href="https://wa.me/5511973582931?text=Olá! Vim pelo site da AIPF e gostaria de conversar."
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-gold transition-colors"
            >
              Contato
            </a>
          </nav>
        </div>

        <div className="mt-12 pt-8 border-t border-warm-border">
          <p className="text-text-muted text-xs">
            &copy; {currentYear} AIPF — Integração e Performance. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
