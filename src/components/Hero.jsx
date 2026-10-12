import { useEffect, useState } from 'react';
import { ArrowRight, Code2, GitBranch, Layers3, Mail, MapPin, Server } from 'lucide-react';
import { useLanguage } from '../context/languageStore';
import heroImg from '../assets/hero.png';

const copy = {
  fr: {
    eyebrow: 'DÉVELOPPEUR FULL-STACK · DOUALA, CAMEROUN',
    lead: 'Je transforme vos idées en',
    blue: 'produits digitaux',
    green: 'solides.',
    intro:
      'Je conçois des applications web rapides, des interfaces soignées et des API robustes — de la première idée jusqu’au déploiement.',
    work: 'Voir mes projets',
    contact: 'Me contacter',
    note: 'Disponible pour des missions freelance et des opportunités long terme.',
    proof: [
      ['Full-stack', 'Une vision complète, de l’interface à la base de données.'],
      ['Code fiable', 'Des architectures maintenables, testables et évolutives.'],
      ['Basé à Douala', 'Disponible sur place ou à distance, partout dans le monde.'],
      ['Livraison continue', 'Azure DevOps, Git, revue de code et déploiements CI/CD.'],
    ],
  },
  en: {
    eyebrow: 'FULL-STACK DEVELOPER · DOUALA, CAMEROON',
    lead: 'I turn ideas into',
    blue: 'digital products',
    green: 'that last.',
    intro:
      'I build fast web applications, thoughtful interfaces and robust APIs — from the first idea to production.',
    work: 'View my work',
    contact: 'Contact me',
    note: 'Available for freelance missions and long-term opportunities.',
    proof: [
      ['Full-stack', 'One complete vision, from interface to database.'],
      ['Reliable code', 'Maintainable, testable and scalable architectures.'],
      ['Based in Douala', 'Available locally or remotely, worldwide.'],
      ['Continuous delivery', 'Azure DevOps, Git, code reviews and CI/CD deployments.'],
    ],
  },
};
const profiles = [
  {
    role: 'Full-stack developer',
    details: [
      [MapPin, 'Douala, Cameroun'],
      [Mail, 'gassiruphin@gmail.com'],
    ],
  },
  {
    role: 'Front-end engineer',
    details: [
      [Code2, 'React.js · JavaScript'],
      [MapPin, 'Douala, Cameroun'],
    ],
  },
  {
    role: 'Back-end & API developer',
    details: [
      [Server, 'C# · Node.js · SQL Server'],
      [GitBranch, 'Azure DevOps · CI/CD'],
    ],
  },
];
export default function Hero() {
  const { lang } = useLanguage();
  const t = copy[lang];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setActive((value) => (value + 1) % profiles.length), 4500);
    return () => clearInterval(timer);
  }, []);
  const icons = [Layers3, Code2, MapPin, GitBranch];
  return (
    <>
      <section className="hero section" id="home">
        <div className="hero-copy">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>
            {t.lead} <span className="blue">{t.blue}</span> <span className="green">{t.green}</span>
          </h1>
          <p className="hero-intro">{t.intro}</p>
          <div className="button-row">
            <a className="button primary" href="#projects">
              {t.work}
              <ArrowRight size={18} />
            </a>
            <a className="button secondary" href="#contact">
              {t.contact}
              <ArrowRight size={18} />
            </a>
          </div>
          <p className="small-note">{t.note}</p>
        </div>
        <div className="hero-visual">
          <div className="grid-pattern" />
          {profiles.map((profile, index) => {
            const position = (index - active + 3) % 3;
            const slot = position === 0 ? 'is-active' : position === 1 ? 'is-right' : 'is-left';
            return (
              <article className={`portrait-card carousel-card ${slot}`} key={profile.role}>
                <div className="portrait-wrap">
                  <img src={heroImg} alt={`Ruphin Gassi, ${profile.role}`} />
                </div>
                <div className="profile-info">
                  <h2>Ruphin Gassi</h2>
                  <p>{profile.role}</p>
                  {profile.details.map(([Icon, label]) => (
                    <span key={label}>
                      <Icon size={15} />
                      {label}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
          <div className="dots">
            {profiles.map((profile, index) => (
              <button
                key={profile.role}
                className={active === index ? 'active' : ''}
                onClick={() => setActive(index)}
                aria-label={profile.role}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="proof-strip">
        {t.proof.map((item, index) => {
          const Icon = icons[index];
          return (
            <article key={item[0]}>
              <span className="proof-icon">
                <Icon />
              </span>
              <div>
                <h3>{item[0]}</h3>
                <p>{item[1]}</p>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
