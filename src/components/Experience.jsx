import { BookOpenCheck, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/languageStore';
import awsCertificate from '../assets/certifications/aws-cloud-practitioner-linkedin.png';
import odcCertificate from '../assets/certifications/odc-certification.png';
import scrumCertificate from '../assets/certifications/scrum-sfc-1198486.png';

const certificateUrl = 'https://www.scrumstudy.com/certification/verify?type=SFC&number=1198486';
const linkedInCertificateUrl = 'https://lnkd.in/eHsJ8Rg8';

const technologies = [
  ['React.js', 'react/react-original.svg', 'Front-end'],
  ['Angular', 'angular/angular-original.svg', 'Front-end'],
  ['JavaScript', 'javascript/javascript-original.svg', 'Langage'],
  ['Python', 'python/python-original.svg', 'Back-end'],
  ['C#', 'csharp/csharp-original.svg', 'Back-end'],
  ['ASP.NET Core', 'dotnetcore/dotnetcore-original.svg', 'Framework'],
  ['Node.js', 'nodejs/nodejs-original.svg', 'Back-end'],
  ['Laravel', 'laravel/laravel-original.svg', 'Framework'],
  ['SQL Server', 'microsoftsqlserver/microsoftsqlserver-original.svg', 'Données'],
  ['MySQL', 'mysql/mysql-original.svg', 'Données'],
  ['Azure DevOps', 'azuredevops/azuredevops-original.svg', 'DevOps'],
  ['Git', 'git/git-original.svg', 'CI/CD'],
].map(([name, path, group]) => ({
  name,
  group,
  icon: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${path}`,
}));

const copy = {
  fr: {
    kicker: 'PARCOURS',
    title: 'Une expérience orientée produit.',
    label: 'TECHNOLOGIES',
    techTitle: 'Les technologies que je mets au service de vos idées',
    intro:
      'Un écosystème moderne pour concevoir des interfaces, des API et des applications métiers fiables.',
    jobs: [
      ['Fév. 2025 — Aujourd’hui', 'Softronic Innoving', 'Développeur Full-stack · CDI'],
      ['Fév. 2024 — Fév. 2025', 'Innov SI', 'Développeur Full-stack · CDD'],
      ['Avr. 2023 — Jan. 2024', 'Laureal Corp', 'Développeur Front-end · CDD'],
      ['Août 2022 — Mars 2023', 'Orange Digital Center', 'Chef de projet & Développeur Back-end'],
      ['Juin — Oct. 2021', 'Orange Digital Center', 'Apprenant à l’école du code'],
      ['Août — Oct. 2020', 'TELIS LTD', 'Technicien Réseaux & Développeur Front-end'],
    ],
    education: [
      ['2021 — 2022', 'Licence Technologique en Génie Logiciel', 'IUT · Université de Douala'],
      ['2019 — 2021', 'BTS en Génie Logiciel', 'Institut Universitaire de la Côte · ISTDI'],
      ['12 octobre 2026', 'Scrum Fundamentals Certified', 'SCRUMstudy · ID 1198486'],
      [
        '23 juillet 2026',
        'Préparer la certification AWS Cloud Practitioner : Les bases',
        'LinkedIn Learning · AWS Cloud',
      ],
      ['23 décembre 2021', 'Développement Web avec ASP', 'Orange Digital Center'],
    ],
    verify: 'Vérifier la certification',
    educationLabel: 'FORMATION',
    educationTitle: 'Études & certifications',
    educationIntro: 'Un parcours technique complété par des certifications professionnelles.',
  },
  en: {
    kicker: 'JOURNEY',
    title: 'Product-minded experience.',
    label: 'TECHNOLOGIES',
    techTitle: 'The technologies I put to work for your ideas',
    intro: 'A modern ecosystem for building reliable interfaces, APIs and business applications.',
    jobs: [
      ['Feb. 2025 — Today', 'Softronic Innoving', 'Full-stack Developer · Permanent'],
      ['Feb. 2024 — Feb. 2025', 'Innov SI', 'Full-stack Developer'],
      ['Apr. 2023 — Jan. 2024', 'Laureal Corp', 'Front-end Developer'],
      ['Aug. 2022 — Mar. 2023', 'Orange Digital Center', 'Project Lead & Back-end Developer'],
      ['Jun. — Oct. 2021', 'Orange Digital Center', 'Code School Learner'],
      ['Aug. — Oct. 2020', 'TELIS LTD', 'Network Technician & Front-end Developer'],
    ],
    education: [
      [
        '2021 — 2022',
        'Bachelor of Technology in Software Engineering',
        'University Institute of Technology · Douala',
      ],
      [
        '2019 — 2021',
        'Higher National Diploma in Software Engineering',
        'Institut Universitaire de la Côte · ISTDI',
      ],
      ['October 12, 2026', 'Scrum Fundamentals Certified', 'SCRUMstudy · ID 1198486'],
      [
        'July 23, 2026',
        'Prepare for the AWS Cloud Practitioner Certification: The Basics',
        'LinkedIn Learning · AWS Cloud',
      ],
      ['December 23, 2021', 'Web Development with ASP', 'Orange Digital Center'],
    ],
    verify: 'Verify certification',
    educationLabel: 'EDUCATION',
    educationTitle: 'Education & certifications',
    educationIntro: 'A technical background strengthened by professional certifications.',
  },
};

export default function Experience() {
  const { lang } = useLanguage();
  const t = copy[lang];
  const icons = [BookOpenCheck, BookOpenCheck, BookOpenCheck, BookOpenCheck, BookOpenCheck];
  const certificateImages = [scrumCertificate, awsCertificate, odcCertificate];
  const certificateUrls = [certificateUrl, linkedInCertificateUrl, odcCertificate];

  return (
    <section className="journey section" id="journey">
      <div className="section-heading">
        <p className="eyebrow">{t.kicker}</p>
        <h2>{t.title}</h2>
      </div>

      <div className="journey-grid">
        <div className="timeline">
          {t.jobs.map((job) => (
            <article key={job[0] + job[1]}>
              <span className="timeline-dot" />
              <time>{job[0]}</time>
              <h3>{job[1]}</h3>
              <p>{job[2]}</p>
            </article>
          ))}
        </div>

        <div>
          <div className="stack-card">
            <div className="tech-heading">
              <p className="eyebrow">{t.label}</p>
              <span className="tech-orbit">
                <i />
                <i />
                <i />
              </span>
            </div>
            <h3>{t.techTitle}</h3>
            <p className="stack-intro">{t.intro}</p>
            <div className="tech-grid">
              {technologies.map((tech) => (
                <article key={tech.name}>
                  <div className="tech-logo">
                    <img src={tech.icon} alt="" loading="lazy" />
                  </div>
                  <div>
                    <small>{tech.group}</small>
                    <strong>{tech.name}</strong>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="education-card" id="education">
            <header className="education-heading">
              <p className="eyebrow">{t.educationLabel}</p>
              <h3>{t.educationTitle}</h3>
              <p>{t.educationIntro}</p>
            </header>
            <div>
              {t.education.map((item, index) => {
                const Icon = icons[index];
                const content = (
                  <>
                    <div className="education-icon">
                      <Icon />
                    </div>
                    {index >= 2 && (
                      <div className="certificate-preview">
                        <img
                          src={certificateImages[index - 2]}
                          alt={`${item[1]} — ${item[2]}`}
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="education-copy">
                      <time>{item[0]}</time>
                      <h3>{item[1]}</h3>
                      <p>{item[2]}</p>
                      {index >= 2 && (
                        <span className="verify-label">
                          {t.verify}
                          <ExternalLink />
                        </span>
                      )}
                    </div>
                  </>
                );

                return index >= 2 ? (
                  <a
                    className="education-item certificate-item"
                    href={certificateUrls[index - 2]}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${item[1]} — ${t.verify}`}
                    key={item[1]}
                  >
                    {content}
                  </a>
                ) : (
                  <article className="education-item" key={item[1]}>
                    {content}
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
