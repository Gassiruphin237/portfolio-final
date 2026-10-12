import { Mail, Phone } from 'lucide-react';
import { useLanguage } from '../context/languageStore';
const GithubIcon = () => (
  <svg viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.6 9.6 0 0 1 12 6.84c.85 0 1.71.12 2.5.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
    />
  </svg>
);
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M6.5 8.5H3.3V19h3.2V8.5ZM4.9 3A1.9 1.9 0 1 0 5 6.8 1.9 1.9 0 0 0 4.9 3ZM20.7 13c0-3.16-1.68-4.63-3.92-4.63a3.39 3.39 0 0 0-3.08 1.7V8.5h-3.2V19h3.2v-5.2c0-1.37.26-2.7 1.96-2.7 1.67 0 1.69 1.57 1.69 2.8V19h3.2l.15-6Z"
    />
  </svg>
);
export default function Footer() {
  const { lang } = useLanguage();
  const t =
    lang === 'fr'
      ? {
          nav: ['Expertise', 'Projets', 'Parcours'],
          tag: 'Des idées ambitieuses. Des produits bien construits.',
          rights: 'Tous droits réservés.',
        }
      : {
          nav: ['Expertise', 'Projects', 'Journey'],
          tag: 'Ambitious ideas. Well-built products.',
          rights: 'All rights reserved.',
        };
  return (
    <footer>
      <div className="footer-brand">
        <span className="brand-mark">RG</span>
        <strong>RUPHIN GASSI</strong>
        <p>{t.tag}</p>
      </div>
      <div className="footer-links">
        <a href="#expertise">{t.nav[0]}</a>
        <a href="#projects">{t.nav[1]}</a>
        <a href="#journey">{t.nav[2]}</a>
      </div>
      <div className="social-icons">
        <a
          href="https://github.com/Gassiruphin237"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          <GithubIcon />
        </a>
        <a
          href="https://www.linkedin.com/in/ruphin-gassi-a401751a5/"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          <LinkedinIcon />
        </a>
        <a href="mailto:gassiruphin@gmail.com" aria-label="E-mail">
          <Mail />
        </a>
        <a href="tel:+237697814134" aria-label="Téléphone">
          <Phone />
        </a>
      </div>
      <p className="copyright">
        © {new Date().getFullYear()} Ruphin Gassi. {t.rights}
      </p>
    </footer>
  );
}
