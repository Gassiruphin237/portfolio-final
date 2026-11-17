/**
 * githubService.js
 * Récupère les données publiques GitHub de Ruphin Gassi.
 * - Stats utilisateur
 * - Langages les plus utilisés
 * - Activité récente (events publics)
 * - Heatmap des contributions via github-contributions-api (sans token)
 */

const USERNAME    = 'Gassiruphin237';
const GH_API      = 'https://api.github.com';
const CONTRIB_API = `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`;
const TIMEOUT_MS  = 10_000;

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: { Accept: 'application/json', ...(options.headers ?? {}) },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } finally {
    clearTimeout(id);
  }
}

export async function getGitHubUser() {
  return fetchWithTimeout(`${GH_API}/users/${USERNAME}`);
}

export async function getGitHubRepos() {
  const repos = await fetchWithTimeout(
    `${GH_API}/users/${USERNAME}/repos?per_page=100&sort=pushed`,
  );
  return repos.sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0));
}

export async function getTopLanguages() {
  const repos = await getGitHubRepos();
  const count = {};
  for (const repo of repos) {
    if (repo.language) count[repo.language] = (count[repo.language] ?? 0) + 1;
  }
  return Object.entries(count)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([lang, c]) => ({ lang, count: c }));
}

export async function getRecentActivity() {
  const events = await fetchWithTimeout(
    `${GH_API}/users/${USERNAME}/events/public?per_page=20`,
  );
  const seen = new Set();
  const result = [];
  for (const e of events) {
    const key = `${e.type}-${e.repo.name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(e);
    if (result.length >= 6) break;
  }
  return result;
}

export async function getContributions() {
  return fetchWithTimeout(CONTRIB_API);
}

export async function getAllGitHubData() {
  const [user, repos, languages, activity, contributions] = await Promise.allSettled([
    getGitHubUser(),
    getGitHubRepos(),
    getTopLanguages(),
    getRecentActivity(),
    getContributions(),
  ]);

  return {
    user:          user.status          === 'fulfilled' ? user.value          : null,
    repos:         repos.status         === 'fulfilled' ? repos.value         : [],
    languages:     languages.status     === 'fulfilled' ? languages.value     : [],
    activity:      activity.status      === 'fulfilled' ? activity.value      : [],
    contributions: contributions.status === 'fulfilled' ? contributions.value : null,
  };
}
