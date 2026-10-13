import { useEffect, useState } from 'react';
import { ArrowRight, Code2, GitBranch, Layers3, Mail, MapPin, Server } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/languageStore';
import heroImg from '../assets/hero.png';
import heroTwoImg from '../assets/hero2.png';
import heroThreeImg from '../assets/hero3.png';
import { reveal, revealViewport, stagger } from './motionPresets';

const copy = {
  fr: {
    eyebrow: 'DÉVELOPPEUR - RUPHIN GASSI',
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
    eyebrow: 'DEVELOPER - RUPHIN GASSI',
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
    title: 'Ruphin Gassi',
    role: 'Full-stack developer',
    image: heroImg,
    imagePosition: 'center 10%',
    details: [
      [MapPin, 'Douala, Cameroun'],
      [Mail, 'gassiruphin@gmail.com'],
    ],
  },
  {
    title: 'JavaScript',
    role: 'Interfaces web modernes',
    image: heroTwoImg,
    imagePosition: 'center 42%',
    details: [
      [Code2, 'React.js · Angular'],
      [Layers3, 'Responsive · accessible'],
    ],
  },
  {
    title: 'Azure DevOps',
    role: 'CI/CD & déploiements',
    image: heroThreeImg,
    imagePosition: 'center 32%',
    details: [
      [GitBranch, 'Pipelines · Git'],
      [Server, 'Tests · mise en production'],
    ],
  },
];
export default function Hero({ shouldAnimate }) {
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
        <motion.div
          className="hero-copy"
          variants={stagger}
          initial="hidden"
          animate={shouldAnimate ? 'visible' : 'hidden'}
        >
          <motion.p className="eyebrow" variants={reveal}>
            {t.eyebrow}
          </motion.p>
          <motion.h1 variants={reveal}>
            {t.lead} <span className="blue">{t.blue}</span> <span className="green">{t.green}</span>
          </motion.h1>
          <motion.p className="hero-intro" variants={reveal}>
            {t.intro}
          </motion.p>
          <motion.div className="button-row" variants={reveal}>
            <a className="button primary" href="#projects">
              {t.work}
              <ArrowRight size={18} />
            </a>
            <a className="button secondary" href="#contact">
              {t.contact}
              <ArrowRight size={18} />
            </a>
          </motion.div>
          <motion.p className="small-note" variants={reveal}>
            {t.note}
          </motion.p>
        </motion.div>
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, y: 14 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.42, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid-pattern" />
          {profiles.map((profile, index) => {
            const position = (index - active + 3) % 3;
            const slot = position === 0 ? 'is-active' : position === 1 ? 'is-right' : 'is-left';
            return (
              <article className={`portrait-card carousel-card ${slot}`} key={profile.role}>
                <div className="portrait-wrap">
                  <img
                    src={profile.image}
                    alt={`Ruphin Gassi, ${profile.role}`}
                    style={{ objectPosition: profile.imagePosition }}
                  />
                </div>
                <div className="profile-info">
                  <h2>{profile.title}</h2>
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
        </motion.div>
      </section>
      <motion.section
        className="proof-strip"
        variants={stagger}
        initial="hidden"
        whileInView={shouldAnimate ? 'visible' : 'hidden'}
        viewport={revealViewport}
      >
        {t.proof.map((item, index) => {
          const Icon = icons[index];
          return (
            <motion.article key={item[0]} variants={reveal}>
              <span className="proof-icon">
                <Icon />
              </span>
              <div>
                <h3>{item[0]}</h3>
                <p>{item[1]}</p>
              </div>
            </motion.article>
          );
        })}
      </motion.section>
    </>
  );
}
