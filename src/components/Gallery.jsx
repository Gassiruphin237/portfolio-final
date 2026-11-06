/**
 * CurvedGalleryHero — rebuilt from blueprint curved-gallery-hero.tsx
 * (manifest sha256 13653801…, verified before porting).
 * Blueprint content treated as untrusted data per guide security rules.
 *
 * Adaptations for this portfolio:
 *  - JSX instead of TSX; no TypeScript annotations
 *  - motion/react (already installed) instead of framer-motion
 *  - Lucide icons (Pause / Play) instead of react-icons
 *  - <img> instead of Next.js <Image>
 *  - Images loaded from galleryService and passed via the `items` prop
 *  - Copy comes from the existing Gallery section (fr/en bilingual)
 *  - Blueprint's Caveat/handwritten note omitted (font not loaded here)
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useTransform,
} from 'motion/react';
import { useLanguage } from '../context/languageStore';
import { getGalleryImages } from '../services/galleryService';
import {
  getCurvedGalleryPose,
  getCurvedGalleryPosition,
} from '../lib/curved-gallery';
import { Reveal } from './CurvedGalleryReveal';

// ─── Geometry ────────────────────────────────────────────────────────────────
const WIDE_GEOMETRY  = { radius: 70, stepDegrees: 9.5,  visibleSlots: 4.6 };
const NARROW_GEOMETRY = { radius: 90, stepDegrees: 16.5, visibleSlots: 2.6 };

const MAX_FRAME_MS = 50;
const EASE_OUT     = [0.22, 1, 0.36, 1];

// ─── Bilingual copy ───────────────────────────────────────────────────────────
const copy = {
  fr: {
    badge:   'GALERIE',
    heading: 'Quelques instants\nau-delà du code.',
    desc:    'Des rencontres, des apprentissages et des moments qui nourrissent mon regard de développeur.',
    pause:   'Mettre en pause',
    play:    'Lancer le défilement',
    loading: 'Chargement…',
    error:   'Photos bientôt disponibles.',
    empty:   'Aucune photo pour le moment.',
  },
  en: {
    badge:   'GALLERY',
    heading: 'A few moments\nbeyond the code.',
    desc:    'Meetings, learning and moments that shape my perspective as a developer.',
    pause:   'Pause',
    play:    'Play',
    loading: 'Loading…',
    error:   'Photos will be available soon.',
    empty:   'No photos yet.',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** Match window width once; re-evaluated only on mount (SSR-safe fallback). */
function useIsWide() {
  const [wide, setWide] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true,
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e) => setWide(e.matches);
    mq.addEventListener('change', handler);
    setWide(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return wide;
}

/** Returns false while the page is hidden (tab blur / visibility). */
function usePageVisible() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const handler = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);
  return visible;
}

// ─── Single curved card ───────────────────────────────────────────────────────
function CurvedCard({ item, index, count, offset, geometry, entered }) {
  const pose = useTransform(offset, (v) =>
    getCurvedGalleryPose(getCurvedGalleryPosition(index, count, v), geometry),
  );
  const transform  = useTransform(pose, (p) => p.transform);
  const opacity    = useTransform(pose, (p) => p.opacity);
  const zIndex     = useTransform(pose, (p) => p.zIndex);
  const visibility = useTransform(opacity, (v) => (v <= 0 ? 'hidden' : 'visible'));

  // Stagger the entrance: cards further from center come in a bit later
  const introDelay =
    0.35 + Math.abs(getCurvedGalleryPosition(index, count, 0)) * 0.08;

  return (
    <motion.li
      style={{ transform, opacity, zIndex, visibility }}
      className="cgh-card"
    >
      <motion.span
        initial={{ opacity: 0, y: 60 }}
        animate={entered ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.9, delay: introDelay, ease: EASE_OUT }}
        className="cgh-card-inner"
      >
        <img
          src={item.url}
          alt={item.alt}
          loading="lazy"
          className="cgh-card-img"
        />
      </motion.span>
    </motion.li>
  );
}

// ─── NoteArrow SVG (drawn on viewport entry) ─────────────────────────────────
function NoteArrow() {
  return (
    <svg viewBox="0 0 120 90" fill="none" aria-hidden className="cgh-arrow-svg">
      <motion.path
        d="M108 6 C 112 40, 90 70, 52 72 C 34 73, 22 66, 14 58"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.9, ease: EASE_OUT }}
      />
      <motion.path
        d="M26 48 L 13 58 L 29 64"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: 1.7, ease: EASE_OUT }}
      />
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
/**
 * @param {{
 *   items: Array<{ id: string, url: string, alt: string }>,
 *   status: 'loading' | 'ready' | 'error',
 *   speed?: number,
 * }} props
 */
export function CurvedGalleryHero({ items, status, speed = 0.45 }) {
  const { lang } = useLanguage();
  const t = copy[lang];

  const sectionRef  = useRef(null);
  const isInView    = useInView(sectionRef);
  const hasEntered  = useInView(sectionRef, { once: true, amount: 0.2 });
  const pageVisible = usePageVisible();
  const isWide      = useIsWide();

  const [hovered, setHovered] = useState(false);
  const [paused,  setPaused]  = useState(false);

  const offset   = useMotionValue(0);
  const geometry = isWide ? WIDE_GEOMETRY : NARROW_GEOMETRY;
  const moving   = isInView && pageVisible && !paused && !hovered;

  useAnimationFrame((_, delta) => {
    if (moving) offset.set(offset.get() + (speed * Math.min(delta, MAX_FRAME_MS)) / 1000);
  });

  const headingLines = t.heading.split('\n');

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="cgh-section section"
      aria-label={t.badge}
    >
      {/* ── Text header ───────────────────────────────────────── */}
      <div className="cgh-header">
        {/* Badge */}
        <Reveal preset="fade" duration={0.6}>
          <span className="cgh-badge eyebrow">{t.badge}</span>
        </Reveal>

        {/* Heading — each line blurs in */}
        <h2 className="cgh-heading">
          {headingLines.map((line, i) => (
            <Reveal
              key={line}
              as="span"
              preset="blur"
              duration={0.85}
              delay={0.1 + i * 0.12}
              className="cgh-heading-line"
            >
              {line}
            </Reveal>
          ))}
        </h2>

        {/* Description */}
        <Reveal preset="slide-up" distance={16} duration={0.7} delay={0.35}>
          <p className="cgh-desc">{t.desc}</p>
        </Reveal>
      </div>

      {/* ── Carousel ──────────────────────────────────────────── */}
      <div className="cgh-stage-wrap">
        {status === 'loading' && (
          <p className="cgh-status" aria-live="polite">{t.loading}</p>
        )}

        {status === 'error' && (
          <p className="cgh-status">{t.error}</p>
        )}

        {status === 'ready' && items.length === 0 && (
          <p className="cgh-status">{t.empty}</p>
        )}

        {status === 'ready' && items.length > 0 && (
          <>
            <ul
              key={isWide ? 'wide' : 'narrow'}
              className="cgh-track"
              aria-label={`${t.badge}, carousel`}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {items.map((item, index) => (
                <CurvedCard
                  key={item.id}
                  item={item}
                  index={index}
                  count={items.length}
                  offset={offset}
                  geometry={geometry}
                  entered={hasEntered}
                />
              ))}
            </ul>

            {/* Pause / play button */}
            <button
              type="button"
              aria-label={paused ? t.play : t.pause}
              className="cgh-pause-btn"
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? <Play size={16} aria-hidden /> : <Pause size={16} aria-hidden />}
            </button>
          </>
        )}
      </div>
    </section>
  );
}

// ─── Data-fetching shell (drop-in replacement for old <Gallery />) ────────────
const MAX_IMAGES = 16;

export default function Gallery() {
  const [items,  setItems]  = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    getGalleryImages()
      .then((imgs) => {
        if (cancelled) return;
        setItems(imgs.slice(0, MAX_IMAGES));
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => { cancelled = true; };
  }, []);

  return <CurvedGalleryHero items={items} status={status} />;
}
