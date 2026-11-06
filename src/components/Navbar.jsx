import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUp, Globe2, Menu, Moon, Sun, X } from 'lucide-react';
import { useLanguage } from '../context/languageStore';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="22" height="22">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.417A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Zm0 18a7.95 7.95 0 0 1-4.054-1.107l-.29-.172-2.953.84.872-2.875-.19-.295A7.96 7.96 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8Zm4.406-5.884c-.242-.121-1.432-.707-1.654-.787-.222-.08-.384-.121-.545.121-.161.242-.625.787-.766.949-.141.161-.282.181-.524.06-.242-.12-1.021-.376-1.944-1.198-.718-.64-1.203-1.43-1.344-1.672-.141-.242-.015-.373.106-.493.109-.108.242-.282.363-.423.12-.141.161-.242.242-.403.08-.161.04-.303-.02-.424-.061-.12-.545-1.316-.747-1.8-.197-.472-.397-.408-.545-.416l-.464-.008a.89.89 0 0 0-.645.303c-.222.242-.847.827-.847 2.017s.867 2.34.988 2.502c.12.161 1.706 2.607 4.134 3.654.578.25 1.029.398 1.38.51.58.184 1.108.158 1.526.096.465-.069 1.432-.585 1.634-1.15.2-.564.2-1.048.14-1.149-.06-.1-.222-.161-.464-.282Z" />
  </svg>
);

const copy = {
  fr: { nav: ['Expertise', 'Galerie', 'Projets', 'Parcours', 'Études'], contact: 'Me contacter' },
  en: { nav: ['Expertise', 'Gallery', 'Projects', 'Journey', 'Education'], contact: 'Contact me' },
};

const WA_NUMBER = '237697814134';

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

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const waLabel = lang === 'fr' ? 'Écrire sur WhatsApp' : 'Chat on WhatsApp';

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
          <a href="#expertise" onClick={() => setOpen(false)}>{t.nav[0]}</a>
          <a href="#gallery"   onClick={() => setOpen(false)}>{t.nav[1]}</a>
          <a href="#projects"  onClick={() => setOpen(false)}>{t.nav[2]}</a>
          <a href="#journey"   onClick={() => setOpen(false)}>{t.nav[3]}</a>
          <a href="#education" onClick={() => setOpen(false)}>{t.nav[4]}</a>
        </nav>

        <div className="nav-actions">
          <button
            className="icon-button theme-toggle"
            type="button"
            onClick={() => setDarkMode((c) => !c)}
            aria-label={darkMode
              ? (lang === 'fr' ? 'Activer le mode clair'   : 'Enable light mode')
              : (lang === 'fr' ? 'Activer le mode sombre'  : 'Enable dark mode')}
            title={darkMode
              ? (lang === 'fr' ? 'Mode clair'  : 'Light mode')
              : (lang === 'fr' ? 'Mode sombre' : 'Dark mode')}
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

      {/* ── Floating WhatsApp button ───────────────────────────────────────── */}
      <a
        className="wa-fab"
        href={`https://wa.me/${WA_NUMBER}`}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={waLabel}
        title={waLabel}
      >
        <WhatsAppIcon />
      </a>

      {/* ── Back to top ───────────────────────────────────────────────────── */}
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
