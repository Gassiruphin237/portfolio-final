import { Code2, Layers3, Server } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/languageStore';
import { reveal, revealViewport, stagger } from './motionPresets';
const copy = {
  fr: {
    title: 'Un seul partenaire.',
    sub: 'Toute la chaîne produit.',
    intro:
      'Je réunis design d’interface, développement et architecture pour livrer des expériences cohérentes, sans rupture entre les métiers.',
    items: [
      [
        '01',
        'Interfaces web',
        'Des écrans accessibles, responsives et fidèles à votre identité, développés avec React et JavaScript.',
      ],
      [
        '02',
        'Back-end & API',
        'Des services sécurisés avec C#, ASP.NET Core, Node.js, Laravel, SQL Server et MySQL.',
      ],
      [
        '03',
        'Architecture & livraison',
        'Une base technique propre, Azure DevOps, Git et une mise en production maîtrisée.',
      ],
    ],
  },
  en: {
    title: 'One partner.',
    sub: 'The whole product chain.',
    intro:
      'I bring interface design, development and architecture together to deliver consistent experiences.',
    items: [
      ['01', 'Web interfaces', 'Accessible, responsive screens built with React and JavaScript.'],
      ['02', 'Back-end & APIs', 'Secure services with C#, Node.js, Laravel, SQL Server and MySQL.'],
      [
        '03',
        'Architecture & delivery',
        'Clean foundations, effective Git workflows and controlled production releases.',
      ],
    ],
  },
};
export default function Services() {
  const { lang } = useLanguage();
  const t = copy[lang];
  const icons = [Code2, Server, Layers3];
  return (
    <section className="services section" id="expertise">
      <motion.div
        className="section-heading split"
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        <div>
          <p className="eyebrow">EXPERTISE</p>
          <h2>
            {t.title}
            <br />
            {t.sub}
          </h2>
        </div>
        <p>{t.intro}</p>
      </motion.div>
      <motion.div
        className="service-grid"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        {t.items.map((item, index) => {
          const Icon = icons[index];
          return (
            <motion.article key={item[0]} variants={reveal}>
              <span>{item[0]}</span>
              <div className="service-symbol">
                <Icon />
              </div>
              <h3>{item[1]}</h3>
              <p>{item[2]}</p>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
