import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUp, Globe2, Menu, Moon, Sun, X } from 'lucide-react';
import { useLanguage } from '../context/languageStore';

const copy = {
  fr: { nav: ['Expertise', 'Projets', 'Parcours', 'Études'], contact: 'Me contacter' },
  en: { nav: ['Expertise', 'Projects', 'Journey', 'Education'], contact: 'Contact me' },
};

export default function Navbar() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = window.localStorage.getItem('portfolio-theme');

    if (savedTheme) return savedTheme === 'dark';

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const t = copy[lang];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const contactSection = document.querySelector('#contact');

    if (!contactSection || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setContactVisible(entry.isIntersecting),
      { threshold: 0 },
    );

    observer.observe(contactSection);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const theme = darkMode ? 'dark' : 'light';

    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('portfolio-theme', theme);
  }, [darkMode]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <a className="brand" href="#home">
          <span className="brand-mark">RG</span>
          <span>
            RUPHIN
            <br />
            <b>GASSI</b>
          </span>
        </a>

        <nav className={open ? 'nav-links open' : 'nav-links'}>
          <a href="#expertise" onClick={() => setOpen(false)}>
            {t.nav[0]}
          </a>
          <a href="#projects" onClick={() => setOpen(false)}>
            {t.nav[1]}
          </a>
          <a href="#journey" onClick={() => setOpen(false)}>
            {t.nav[2]}
          </a>
          <a href="#education" onClick={() => setOpen(false)}>
            {t.nav[3]}
          </a>
        </nav>

        <div className="nav-actions">
          <button
            className="icon-button theme-toggle"
            type="button"
            onClick={() => setDarkMode((current) => !current)}
            aria-label={
              darkMode
                ? lang === 'fr'
                  ? 'Activer le mode clair'
                  : 'Enable light mode'
                : lang === 'fr'
                  ? 'Activer le mode sombre'
                  : 'Enable dark mode'
            }
            title={darkMode ? (lang === 'fr' ? 'Mode clair' : 'Light mode') : 'Mode sombre'}
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <button className="language" onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}>
            <Globe2 size={17} />
            {lang.toUpperCase()}
          </button>
          <a className="nav-cta" href="#contact">
            {t.contact}
            <ArrowRight size={17} />
          </a>
          <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <button
        className={`back-to-top${scrolled && !contactVisible ? ' visible' : ''}`}
        type="button"
        onClick={scrollToTop}
        aria-label={lang === 'fr' ? 'Retour en haut' : 'Back to top'}
        title={lang === 'fr' ? 'Retour en haut' : 'Back to top'}
      >
        <ArrowUp />
      </button>
    </>
  );
}
