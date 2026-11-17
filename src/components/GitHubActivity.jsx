/**
 * GitHubActivity — section portfolio
 * Affiche : heatmap des contributions, stats clés, top langages, activité récente
 */
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  GitBranch,
  GitCommitHorizontal,
  Star,
  BookOpen,
  Users,
  Zap,
  GitPullRequest,
  FolderGit2,
} from 'lucide-react';

const GithubIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
);
import { useLanguage } from '../context/languageStore';
import { getAllGitHubData } from '../services/githubService';
import { sectionReveal, sectionViewport, sectionStagger, reveal } from './motionPresets';

// ─── Couleurs des langages ────────────────────────────────────────────────────
const LANG_COLORS = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python:     '#3572A5',
  HTML:       '#e34c26',
  CSS:        '#563d7c',
  Vue:        '#41b883',
  React:      '#61dafb',
  PHP:        '#4f5d95',
  Java:       '#b07219',
  Rust:       '#dea584',
  Go:         '#00add8',
  Ruby:       '#701516',
  Swift:      '#f05138',
  Kotlin:     '#7f52ff',
  Dart:       '#00b4ab',
  Shell:      '#89e051',
};

// ─── Couleurs heatmap (palette terracotta) ────────────────────────────────────
const HEAT_COLORS = ['#f0e6df', '#e9b99b', '#d47b52', '#b55233', '#7a2f18'];

// ─── Copy bilingue ────────────────────────────────────────────────────────────
const copy = {
  fr: {
    badge:        'GITHUB',
    heading:      'Activité\net contributions.',
    desc:         'Un aperçu de mon activité open source, mes dépôts et mes contributions au fil du temps.',
    contributions:'contributions l\'an dernier',
    repos:        'Dépôts publics',
    stars:        'Stars reçues',
    followers:    'Abonnés',
    forks:        'Forks',
    topLangs:     'Langages principaux',
    recent:       'Activité récente',
    viewProfile:  'Voir le profil GitHub',
    loading:      'Chargement…',
    error:        'Données indisponibles.',
    eventTypes: {
      PushEvent:               'Push sur',
      CreateEvent:             'Création dans',
      PullRequestEvent:        'Pull request dans',
      WatchEvent:              'Star sur',
      ForkEvent:               'Fork de',
      IssuesEvent:             'Issue dans',
      IssueCommentEvent:       'Commentaire dans',
      DeleteEvent:             'Suppression dans',
      ReleaseEvent:            'Release dans',
      PublicEvent:             'Rendu public :',
    },
  },
  en: {
    badge:        'GITHUB',
    heading:      'Activity\n& contributions.',
    desc:         'A look at my open source activity, repositories and contributions over time.',
    contributions:'contributions in the last year',
    repos:        'Public repos',
    stars:        'Stars earned',
    followers:    'Followers',
    forks:        'Forks',
    topLangs:     'Top languages',
    recent:       'Recent activity',
    viewProfile:  'View GitHub profile',
    loading:      'Loading…',
    error:        'Data unavailable.',
    eventTypes: {
      PushEvent:               'Pushed to',
      CreateEvent:             'Created in',
      PullRequestEvent:        'Pull request in',
      WatchEvent:              'Starred',
      ForkEvent:               'Forked',
      IssuesEvent:             'Issue in',
      IssueCommentEvent:       'Comment in',
      DeleteEvent:             'Deleted in',
      ReleaseEvent:            'Release in',
      PublicEvent:             'Made public:',
    },
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function eventIcon(type) {
  switch (type) {
    case 'PushEvent':          return <GitCommitHorizontal size={15} />;
    case 'PullRequestEvent':   return <GitPullRequest size={15} />;
    case 'CreateEvent':        return <FolderGit2 size={15} />;
    case 'WatchEvent':         return <Star size={15} />;
    case 'ForkEvent':          return <GitBranch size={15} />;
    default:                   return <Zap size={15} />;
  }
}

function timeAgo(dateStr, lang) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)   return lang === 'fr' ? "à l'instant"  : 'just now';
  if (diff < 3600) return lang === 'fr' ? `il y a ${Math.floor(diff/60)} min`  : `${Math.floor(diff/60)}m ago`;
  if (diff < 86400)return lang === 'fr' ? `il y a ${Math.floor(diff/3600)} h`  : `${Math.floor(diff/3600)}h ago`;
  return lang === 'fr' ? `il y a ${Math.floor(diff/86400)} j` : `${Math.floor(diff/86400)}d ago`;
}

// ─── Heatmap ──────────────────────────────────────────────────────────────────
function ContribHeatmap({ contributions, totalLabel }) {
  if (!contributions?.contributions) return null;

  const days = contributions.contributions;
  // Regrouper par semaine
  const weeks = [];
  let week = [];
  // Remplir les jours manquants au début (aligner sur dimanche)
  const firstDay = new Date(days[0]?.date);
  const startOffset = firstDay.getDay(); // 0=dim
  for (let i = 0; i < startOffset; i++) week.push(null);

  for (const day of days) {
    if (week.length === 7) { weeks.push(week); week = []; }
    week.push(day);
  }
  if (week.length) weeks.push(week);

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const days_fr = ['D','L','M','M','J','V','S'];

  return (
    <div className="gh-heatmap-wrap">
      <div className="gh-heatmap-total">
        <strong>{contributions.total?.lastYear ?? contributions.total}</strong>
        <span>{totalLabel}</span>
      </div>
      <div className="gh-heatmap-grid-outer">
        <div className="gh-heatmap-grid">
          {weeks.map((w, wi) => (
            <div key={wi} className="gh-heatmap-week">
              {Array.from({ length: 7 }).map((_, di) => {
                const cell = w[di];
                if (!cell) return <div key={di} className="gh-cell gh-cell-empty" />;
                const level = Math.min(cell.level ?? 0, 4);
                return (
                  <div
                    key={di}
                    className="gh-cell"
                    style={{ background: HEAT_COLORS[level] }}
                    title={`${cell.date} — ${cell.count} contribution${cell.count !== 1 ? 's' : ''}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="gh-heatmap-legend">
        <span>Less</span>
        {HEAT_COLORS.map((c, i) => (
          <div key={i} className="gh-cell" style={{ background: c }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function GitHubActivity() {
  const { lang } = useLanguage();
  const t = copy[lang];

  const [data,   setData]   = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    setStatus('loading');
    getAllGitHubData()
      .then((d) => { setData(d); setStatus('ready'); })
      .catch(() => setStatus('error'));
  }, []);

  const headingLines = t.heading.split('\n');

  // Stats calculées
  const totalStars = data?.repos?.reduce((s, r) => s + (r.stargazers_count ?? 0), 0) ?? 0;
  const totalForks = data?.repos?.reduce((s, r) => s + (r.forks_count ?? 0), 0) ?? 0;

  const stats = [
    { icon: <BookOpen size={18} />,  label: t.repos,     value: data?.user?.public_repos ?? '—' },
    { icon: <Star size={18} />,      label: t.stars,     value: totalStars || '—' },
    { icon: <Users size={18} />,     label: t.followers, value: data?.user?.followers ?? '—' },
    { icon: <GitBranch size={18} />, label: t.forks,     value: totalForks || '—' },
  ];

  const maxLangCount = data?.languages?.[0]?.count ?? 1;

  return (
    <motion.section
      className="gh-section section"
      id="github"
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
    >
      {/* ── En-tête ─────────────────────────────────────────────────────── */}
      <motion.div
        className="gh-header"
        variants={sectionStagger}
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
      >
        <motion.span className="gh-badge" variants={reveal}>{t.badge}</motion.span>
        <h2 className="gh-heading">
          {headingLines.map((line, i) => (
            <motion.span
              key={i}
              className="gh-heading-line"
              variants={reveal}
            >
              {line}
            </motion.span>
          ))}
        </h2>
        <motion.p className="gh-desc" variants={reveal}>{t.desc}</motion.p>
      </motion.div>

      {/* ── Corps ───────────────────────────────────────────────────────── */}
      {status === 'loading' && (
        <div className="gh-status">{t.loading}</div>
      )}
      {status === 'error' && (
        <div className="gh-status">{t.error}</div>
      )}

      {status === 'ready' && (
        <div className="gh-body">

          {/* Stats */}
          <motion.div
            className="gh-stats"
            variants={sectionStagger}
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
          >
            {stats.map((s) => (
              <motion.div key={s.label} className="gh-stat" variants={reveal}>
                <span className="gh-stat-icon">{s.icon}</span>
                <strong className="gh-stat-value">{s.value}</strong>
                <span className="gh-stat-label">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Heatmap */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
          >
            <ContribHeatmap
              contributions={data.contributions}
              totalLabel={t.contributions}
            />
          </motion.div>

          {/* Bas : langages + activité */}
          <div className="gh-bottom">

            {/* Top langages */}
            <motion.div
              className="gh-langs"
              variants={sectionStagger}
              initial="hidden"
              whileInView="visible"
              viewport={sectionViewport}
            >
              <h3 className="gh-sub-heading">{t.topLangs}</h3>
              {data.languages.map(({ lang: l, count: c }) => (
                <motion.div key={l} className="gh-lang-row" variants={reveal}>
                  <span className="gh-lang-dot" style={{ background: LANG_COLORS[l] ?? '#b55233' }} />
                  <span className="gh-lang-name">{l}</span>
                  <div className="gh-lang-bar-wrap">
                    <motion.div
                      className="gh-lang-bar"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: c / maxLangCount }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      style={{ transformOrigin: 'left' }}
                    />
                  </div>
                  <span className="gh-lang-count">{c}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Activité récente */}
            <motion.div
              className="gh-activity"
              variants={sectionStagger}
              initial="hidden"
              whileInView="visible"
              viewport={sectionViewport}
            >
              <h3 className="gh-sub-heading">{t.recent}</h3>
              {data.activity.map((e, i) => (
                <motion.div key={i} className="gh-event" variants={reveal}>
                  <span className="gh-event-icon">{eventIcon(e.type)}</span>
                  <div className="gh-event-body">
                    <span className="gh-event-label">
                      {t.eventTypes[e.type] ?? e.type}
                    </span>
                    <a
                      href={`https://github.com/${e.repo.name}`}
                      target="_blank"
                      rel="noreferrer"
                      className="gh-event-repo"
                    >
                      {e.repo.name.replace('Gassiruphin237/', '')}
                    </a>
                  </div>
                  <span className="gh-event-time">{timeAgo(e.created_at, lang)}</span>
                </motion.div>
              ))}
            </motion.div>

          </div>

          {/* Lien profil */}
          <motion.a
            href="https://github.com/Gassiruphin237"
            target="_blank"
            rel="noreferrer"
            className="gh-profile-link"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
          >
            <GithubIcon size={17} />
            {t.viewProfile}
          </motion.a>

        </div>
      )}
    </motion.section>
  );
}
