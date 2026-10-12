import { useEffect } from 'react';
import { LanguageProvider } from '../context/LanguageContext';
import { useLanguage } from '../context/languageStore';
import Navbar from './Navbar.jsx';
import Hero from './Hero.jsx';
import Services from './Services.jsx';
import Projects from './Projects.jsx';
import Experience from './Experience.jsx';
import ContactBanner from './ContactBanner.jsx';
import Footer from './Footer.jsx';
import Preloader from './Preloader.jsx';
import '../App.css';

function PortfolioContent() {
  const { lang } = useLanguage();
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return (
    <div className="site-shell">
      <Preloader />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Projects />
        <Experience />
        <ContactBanner />
      </main>
      <Footer />
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <LanguageProvider>
      <PortfolioContent />
    </LanguageProvider>
  );
}
