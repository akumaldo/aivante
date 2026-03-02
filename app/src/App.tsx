import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import AuroraBackground from './components/background/AuroraBackground';
import RightRailNav from './components/navigation/RightRailNav';
import ChatBubble from './components/chat/ChatBubble';

import Hero from './sections/Hero';
import Problem from './sections/Problem';
import Solution from './sections/Solution';
import UseCases from './sections/UseCases';
import Blog from './sections/Blog';
import CTA from './sections/CTA';
import FAQ from './sections/FAQ';
import About from './sections/About';
import Footer from './sections/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // Initialize smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Refresh ScrollTrigger on load
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-900">
      {/* Skip to content - accessibility */}
      <a
        href="#solution"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-slate-900 focus:rounded-lg focus:font-semibold focus:text-sm"
      >
        Pular para o conteúdo
      </a>

      {/* Aurora Background */}
      <AuroraBackground />

      {/* Navigation */}
      <RightRailNav />

      {/* Main Content */}
      <main className="relative z-10">
        <Hero />
        <Problem />
        <Solution />
        <UseCases />
        <Blog />
        <CTA />
        <FAQ />
        <About />
        <Footer />
      </main>

      {/* Chat Assistant */}
      <ChatBubble />
    </div>
  );
}

export default App;
