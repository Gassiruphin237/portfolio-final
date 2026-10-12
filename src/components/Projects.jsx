import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Grid3X3,
  List,
  LockKeyhole,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import { useLanguage } from '../context/languageStore';
import metadata from '../data/projects.json';

const copy = {
  fr: {
    kicker: 'PROJETS RÉALISÉS',
    title: 'Du concret, pas seulement du code.',
    test: 'Tester le projet',
    private: 'Projet d’entreprise · accès privé',
    offline: 'Projet personnel · lien à venir',
    search: 'Rechercher un projet ou une technologie…',
    types: ['Tous les types', 'Entreprise', 'Personnel'],
    allTech: 'Toutes les technologies',
    views: ['Affichage en cartes', 'Affichage en liste'],
    reset: 'Réinitialiser',
    none: 'Aucun projet ne correspond à votre recherche.',
    results: 'projets trouvés',
    items: [
      [
        'SFX eVAT',
        'Normalisation des factures',
        'Application web consacrée à la normalisation et au traitement des factures.',
        ['C#', 'React.js', 'SQL Server', 'Azure DevOps'],
      ],
      [
        'SFX eGUCE',
        'Traitement des manifestes',
        'Génération et traitement de l’import des manifestes au format EDIFACT.',
        ['C#', 'React.js', 'EDIFACT', 'SQL Server'],
      ],
      [
        'SFX PréDouane',
        'Solution métier douanière',
        'Codification des factures et récapitulatifs par dossier maritime pour CAMCIS.',
        ['C#', 'React.js', 'SQL Server', 'CAMCIS'],
      ],
      [
        'PayamAfta',
        'Application web interne',
        'Implémentation de maquettes et intégration continue sur serveur de test.',
        ['React.js', 'Material UI', 'CI/CD'],
      ],
      [
        'PetherCorp',
        'Application web interne',
        'Interfaces, optimisation du code et principes Clean Code.',
        ['React.js', 'Clean Code', 'CI/CD'],
      ],
      [
        'Gestion des collectes',
        'Plateforme de données terrain',
        'Gestion des collectes avec authentification JWT sécurisée.',
        ['Laravel', 'JWT', 'PHP', 'MySQL'],
      ],
      [
        'MybestHealth',
        'Plateforme e-santé & API',
        'Pilotage Scrum, cahier des charges, API et architecture.',
        ['API REST', 'Architecture', 'SCRUM'],
      ],
      [
        'TODO List',
        'Application de formation',
        'Projet React.js réalisé après un apprentissage JavaScript ES6.',
        ['React.js', 'JavaScript'],
      ],
      [
        'Suivi des techniciens',
        'Application web terrain',
        'Suivi des techniciens en intervention sur site.',
        ['Front-end', 'Web', 'Télécoms'],
      ],
    ],
  },
  en: {
    kicker: 'COMPLETED PROJECTS',
    title: 'Real outcomes, not just code.',
    test: 'Open live project',
    private: 'Company project · private access',
    offline: 'Personal project · link coming soon',
    search: 'Search projects or technologies…',
    types: ['All types', 'Company', 'Personal'],
    allTech: 'All technologies',
    views: ['Card view', 'List view'],
    reset: 'Reset',
    none: 'No project matches your search.',
    results: 'projects found',
    items: [
      [
        'SFX eVAT',
        'Invoice normalization',
        'Web application for invoice normalization and processing.',
        ['C#', 'React.js', 'SQL Server', 'Azure DevOps'],
      ],
      [
        'SFX eGUCE',
        'Manifest processing',
        'Generation and processing of EDIFACT manifest imports.',
        ['C#', 'React.js', 'EDIFACT', 'SQL Server'],
      ],
      [
        'SFX PréDouane',
        'Customs solution',
        'Invoice coding and maritime summaries for CAMCIS.',
        ['C#', 'React.js', 'SQL Server', 'CAMCIS'],
      ],
      [
        'PayamAfta',
        'Internal web application',
        'Web mockups and continuous test-server integration.',
        ['React.js', 'Material UI', 'CI/CD'],
      ],
      [
        'PetherCorp',
        'Internal web application',
        'Interfaces, optimization and Clean Code practices.',
        ['React.js', 'Clean Code', 'CI/CD'],
      ],
      [
        'Data Collection',
        'Field data platform',
        'Collection management with secure JWT authentication.',
        ['Laravel', 'JWT', 'PHP', 'MySQL'],
      ],
      [
        'MybestHealth',
        'e-Health platform & APIs',
        'Scrum leadership, specifications, APIs and architecture.',
        ['REST API', 'Architecture', 'SCRUM'],
      ],
      [
        'TODO List',
        'Training application',
        'React project built after learning JavaScript ES6.',
        ['React.js', 'JavaScript'],
      ],
      [
        'Technician Tracking',
        'Field web application',
        'Tracking technicians during on-site assignments.',
        ['Front-end', 'Web', 'Telecoms'],
      ],
    ],
  },
};
export default function Projects() {
  const { lang } = useLanguage();
  const t = copy[lang];
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [tech, setTech] = useState('all');
  const [view, setView] = useState('cards');
  const [page, setPage] = useState(1);
  const technologies = [...new Set(t.items.flatMap((item) => item[3]))].sort();
  const filtered = t.items
    .map((project, index) => ({ project, meta: metadata[index], index }))
    .filter(
      ({ project, meta }) =>
        (!search.trim() ||
          project.flat(2).join(' ').toLowerCase().includes(search.toLowerCase())) &&
        (type === 'all' || meta?.type === type) &&
        (tech === 'all' || project[3].includes(tech)),
    );
  const pages = Math.max(1, Math.ceil(filtered.length / 5));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * 5, current * 5);
  const reset = () => {
    setSearch('');
    setType('all');
    setTech('all');
    setPage(1);
  };
  return (
    <section className="projects section" id="projects">
      <div className="section-heading">
        <p className="eyebrow">{t.kicker}</p>
        <h2>{t.title}</h2>
      </div>
      <div className="project-toolbar">
        <label className="project-search">
          <Search />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={t.search}
          />
          {search && (
            <button
              onClick={() => {
                setSearch('');
                setPage(1);
              }}
            >
              <X />
            </button>
          )}
        </label>
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">{t.types[0]}</option>
          <option value="entreprise">{t.types[1]}</option>
          <option value="personnel">{t.types[2]}</option>
        </select>
        <select
          value={tech}
          onChange={(e) => {
            setTech(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">{t.allTech}</option>
          {technologies.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <button
          className="reset-filters"
          onClick={reset}
          disabled={!search && type === 'all' && tech === 'all'}
        >
          <RotateCcw />
          {t.reset}
        </button>
        <div className="view-switch">
          <button
            className={view === 'cards' ? 'active' : ''}
            onClick={() => setView('cards')}
            title={t.views[0]}
          >
            <Grid3X3 />
          </button>
          <button
            className={view === 'list' ? 'active' : ''}
            onClick={() => setView('list')}
            title={t.views[1]}
          >
            <List />
          </button>
        </div>
      </div>
      <div className="project-count">
        {filtered.length} {t.results}
      </div>
      <div className={`project-list ${view === 'list' ? 'list-view' : ''}`}>
        {visible.map(({ project, meta, index }) => {
          const online = meta?.type === 'personnel' && meta?.status === 'en_ligne' && meta?.url;
          return (
            <article className="project-card" key={meta?.id}>
              <div className={`project-art art-${(index % 3) + 1}`}>
                <span className="window-dot" />
                <span className="window-dot" />
                <span className="window-dot" />
                <div className="mock-panel">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
              <div className="project-copy">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p className="project-type">{project[1]}</p>
                <h3>{project[0]}</h3>
                <p>{project[2]}</p>
                <div className="tags">
                  {project[3].map((value) => (
                    <b key={value}>{value}</b>
                  ))}
                </div>
                <div className="project-access">
                  {online ? (
                    <a href={meta.url} target="_blank" rel="noreferrer">
                      {t.test}
                      <ExternalLink />
                    </a>
                  ) : (
                    <span>
                      <LockKeyhole />
                      {meta?.type === 'personnel' ? t.offline : t.private}
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {!visible.length && (
        <div className="empty-projects">
          <Search />
          <p>{t.none}</p>
        </div>
      )}
      {filtered.length > 5 && (
        <nav className="pagination">
          <button
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={current === 1}
          >
            <ChevronLeft />
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((value) => (
            <button
              key={value}
              className={current === value ? 'active' : ''}
              onClick={() => setPage(value)}
            >
              {value}
            </button>
          ))}
          <button
            onClick={() => setPage((value) => Math.min(pages, value + 1))}
            disabled={current === pages}
          >
            <ChevronRight />
          </button>
        </nav>
      )}
    </section>
  );
}
