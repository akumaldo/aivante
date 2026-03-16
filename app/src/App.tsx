import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import TopNavbar from './components/navigation/TopNavbar';
import ChatBubble from './components/chat/ChatBubble';

import Hero from './sections/Hero';
import ValueBar from './sections/ValueBar';
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
    document.documentElement.style.scrollBehavior = 'smooth';
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-warm-black">
      <a
        href="#solution"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-gold focus:text-warm-black focus:rounded-lg focus:font-semibold focus:text-sm"
      >
        Pular para o conteúdo
      </a>

      <TopNavbar />

      <main className="relative z-10">
        <Hero />
        <ValueBar />
        <Problem />
        <Solution />
        <UseCases />
        <Blog />
        <CTA />
        <FAQ />
        <About />
        <Footer />
      </main>

      <ChatBubble />
    </div>
  );
}

export default App;
