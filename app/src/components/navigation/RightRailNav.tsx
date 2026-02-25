import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scrollToSection } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'hero', label: 'Início' },
  { id: 'services', label: 'Como funciona' },
  { id: 'problem', label: 'Desafio' },
  { id: 'framework', label: 'Framework' },
  { id: 'use-cases', label: 'Casos' },
  { id: 'blog', label: 'Insights' },
  { id: 'delivery', label: 'Metodologia' },
  { id: 'cta', label: 'Contato' },
  { id: 'faq', label: 'FAQ' },
  { id: 'about', label: 'Sobre' },
];

const mobileNavItems = ['hero', 'services', 'framework', 'cta', 'about'];

export default function RightRailNav() {
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const viewportCenter = scrollY + viewportHeight * 0.35;

      let closest: { id: string; distance: number } | null = null;

      navItems.forEach((item) => {
        const element = document.getElementById(item.id);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const elementCenter = elementTop + rect.height / 2;
        const distance = Math.abs(viewportCenter - elementCenter);

        if (!closest || distance < closest.distance) {
          closest = { id: item.id, distance };
        }
      });

      if (closest) {
        setActiveSection((closest as { id: string; distance: number }).id);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10" aria-label="Navegação principal">
        <div className="flex justify-around items-center py-3 px-2">
          {mobileNavItems.map((id) => {
            const item = navItems.find((n) => n.id === id);
            if (!item) return null;

            return (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all ${
                  activeSection === id
                    ? 'text-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                aria-current={activeSection === id ? 'true' : undefined}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeSection === id ? 'bg-cyan-400 scale-125' : 'bg-slate-600'
                  }`}
                />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:block" aria-label="Navegação por seções">
      <div className="glass rounded-full py-4 px-2 flex flex-col items-center gap-3">
        {navItems.map((item) => (
          <div key={item.id} className="relative">
            <button
              onClick={() => scrollToSection(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === item.id
                  ? 'bg-cyan-400 scale-125 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                  : 'bg-slate-600 hover:bg-slate-400'
              }`}
              aria-label={item.label}
            />
            
            <AnimatePresence>
              {hoveredItem === item.id && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap"
                >
                  <span className="glass px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200">
                    {item.label}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </nav>
  );
}
