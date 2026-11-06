import { Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../context/languageStore';

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.6 9.6 0 0 1 12 6.84c.85 0 1.71.12 2.5.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M6.5 8.5H3.3V19h3.2V8.5ZM4.9 3A1.9 1.9 0 1 0 5 6.8 1.9 1.9 0 0 0 4.9 3ZM20.7 13c0-3.16-1.68-4.63-3.92-4.63a3.39 3.39 0 0 0-3.08 1.7V8.5h-3.2V19h3.2v-5.2c0-1.37.26-2.7 1.96-2.7 1.67 0 1.69 1.57 1.69 2.8V19h3.2l.15-6Z" />
  </svg>
);

export default function Footer() {
  const { lang } = useLanguage();

  const t =
    lang === 'fr'
      ? {
          cols: [
            {
              heading: 'Navigation',
              links: [
                { label: 'Expertise', href: '#expertise' },
                { label: 'Projets', href: '#projects' },
                { label: 'Parcours', href: '#journey' },
                { label: 'Contact', href: '#contact' },
              ],
            },
            {
              heading: 'Services',
              links: [
                { label: 'Développement Web', href: '#expertise' },
                { label: 'Applications Mobile', href: '#expertise' },
                { label: 'UI / UX Design', href: '#expertise' },
                { label: 'Intégration API', href: '#expertise' },
              ],
            },
            {
              heading: 'Ressources',
              links: [
                { label: 'Télécharger le CV', href: '/CV Ruphin Gasssi Nguefack.pdf', download: true },
                { label: 'GitHub', href: 'https://github.com/Gassiruphin237', external: true },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ruphin-gassi-a401751a5/', external: true },
              ],
            },
            {
              heading: 'Légal',
              links: [
                { label: 'Confidentialité', href: '#' },
                { label: 'Mentions légales', href: '#' },
              ],
            },
          ],
          contact: {
            heading: 'Contact',
            email: 'gassiruphin@gmail.com',
            phone: '+237 697 814 134',
          },
          address: 'Douala, Cameroun',
          rights: 'Tous droits réservés.',
          tagline: 'Des idées ambitieuses. Des produits bien construits.',
        }
      : {
          cols: [
            {
              heading: 'Navigation',
              links: [
                { label: 'Expertise', href: '#expertise' },
                { label: 'Projects', href: '#projects' },
                { label: 'Journey', href: '#journey' },
                { label: 'Contact', href: '#contact' },
              ],
            },
            {
              heading: 'Services',
              links: [
                { label: 'Web Development', href: '#expertise' },
                { label: 'Mobile Apps', href: '#expertise' },
                { label: 'UI / UX Design', href: '#expertise' },
                { label: 'API Integration', href: '#expertise' },
              ],
            },
            {
              heading: 'Resources',
              links: [
                { label: 'Download CV', href: '/CV Ruphin Gasssi Nguefack.pdf', download: true },
                { label: 'GitHub', href: 'https://github.com/Gassiruphin237', external: true },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ruphin-gassi-a401751a5/', external: true },
              ],
            },
            {
              heading: 'Legal',
              links: [
                { label: 'Privacy', href: '#' },
                { label: 'Terms of use', href: '#' },
              ],
            },
          ],
          contact: {
            heading: 'Contact',
            email: 'gassiruphin@gmail.com',
            phone: '+237 697 814 134',
          },
          address: 'Douala, Cameroon',
          rights: 'All rights reserved.',
          tagline: 'Ambitious ideas. Well-built products.',
        };

  return (
    <footer className="site-footer">
      {/* ── Top columns ── */}
      <div className="footer-top section">
        {t.cols.map((col) => (
          <div key={col.heading} className="footer-col">
            <h4 className="footer-col-heading">{col.heading}</h4>
            <ul className="footer-col-list">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    {...(link.download ? { download: true } : {})}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact column */}
        <div className="footer-col footer-col--contact">
          <h4 className="footer-col-heading">{t.contact.heading}</h4>
          <ul className="footer-col-list">
            <li>
              <a href={`mailto:${t.contact.email}`}>{t.contact.email}</a>
            </li>
            <li>
              <a href="tel:+237697814134">{t.contact.phone}</a>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom section">
        <div className="footer-bottom-left">
          <span className="footer-address">
            <MapPin size={13} />
            {t.address}
          </span>
          <p className="footer-copyright">
            © {new Date().getFullYear()} Ruphin Gassi. {t.rights}
          </p>
        </div>

        <div className="footer-social">
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
            <Mail size={18} />
          </a>
          <a href="tel:+237697814134" aria-label="Téléphone">
            <Phone size={18} />
          </a>
        </div>
      </div>

      {/* ── Ghost watermark — SVG stretch : toujours 100% largeur, jamais coupé ── */}
      <div className="footer-watermark" aria-hidden="true">
        <svg
          viewBox="0 0 1000 160"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            x="500"
            y="130"
            textAnchor="middle"
            fontFamily="Manrope, sans-serif"
            fontWeight="800"
            fontSize="150"
            letterSpacing="-4"
            fill="currentColor"
          >
            Ruphin Gassi
          </text>
        </svg>
      </div>
    </footer>
  );
}
