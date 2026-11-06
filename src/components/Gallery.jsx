/**
 * CurvedGalleryHero — rebuilt from blueprint curved-gallery-hero.tsx
 * Adapted for the portfolio: JSX, motion/react, Lucide icons, <img>, bilingual copy,
 * palette matched to the portfolio's warm terracotta/clay theme,
 * larger cards, and a lightbox (click any card to view full-size).
 */

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, X } from 'lucide-react';
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useTransform,
} from 'motion/react';
import { useLanguage } from '../context/languageStore';
import {
  getCurvedGalleryPose,
  getCurvedGalleryPosition,
} from '../lib/curved-gallery';
import { Reveal } from './CurvedGalleryReveal';

// ─── Geometry — wider cards, gentler curve, with visible gap between cards ───
const WIDE_GEOMETRY   = { radius: 68, stepDegrees: 14,   visibleSlots: 3.2 };
const NARROW_GEOMETRY = { radius: 88, stepDegrees: 28,   visibleSlots: 1.6 };

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
    close:   'Fermer',
    view:    'Voir la photo',
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
    close:   'Close',
    view:    'View photo',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

function usePageVisible() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const handler = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);
  return visible;
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ item, onClose, label }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <motion.div
      className="cgh-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.figure
        className="cgh-lightbox-figure"
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ duration: 0.25, ease: EASE_OUT }}
        onClick={(e) => e.stopPropagation()}
      >
        <img src={item.url} alt={item.alt} className="cgh-lightbox-img" />
        {(item.caption || item.alt) && (
          <figcaption className="cgh-lightbox-caption">
            {item.caption || item.alt}
          </figcaption>
        )}
        <button
          type="button"
          className="cgh-lightbox-close"
          onClick={onClose}
          aria-label={label}
        >
          <X size={18} aria-hidden />
        </button>
      </motion.figure>
    </motion.div>
  );
}

// ─── Single curved card ───────────────────────────────────────────────────────
function CurvedCard({ item, index, count, offset, geometry, entered, onOpen, label }) {
  const pose = useTransform(offset, (v) =>
    getCurvedGalleryPose(getCurvedGalleryPosition(index, count, v), geometry),
  );
  const transform  = useTransform(pose, (p) => p.transform);
  const opacity    = useTransform(pose, (p) => p.opacity);
  const zIndex     = useTransform(pose, (p) => p.zIndex);
  const visibility = useTransform(opacity, (v) => (v <= 0 ? 'hidden' : 'visible'));

  const introDelay =
    0.35 + Math.abs(getCurvedGalleryPosition(index, count, 0)) * 0.08;

  return (
    <motion.li
      style={{ transform, opacity, zIndex, visibility }}
      className="cgh-card"
    >
      <motion.button
        type="button"
        initial={{ opacity: 0, y: 60 }}
        animate={entered ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.9, delay: introDelay, ease: EASE_OUT }}
        className="cgh-card-inner"
        onClick={() => onOpen(item)}
        aria-label={`${label}: ${item.alt}`}
      >
        <img
          src={item.url}
          alt={item.alt}
          loading="lazy"
          className="cgh-card-img"
        />
      </motion.button>
    </motion.li>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
/**
 * @param {{
 *   items: Array<{ id: string, url: string, alt: string, caption?: string }>,
 *   status: 'loading' | 'ready' | 'error',
 *   speed?: number,
 * }} props
 */
export function CurvedGalleryHero({ items, status, speed = 0.42 }) {
  const { lang } = useLanguage();
  const t = copy[lang];

  const sectionRef  = useRef(null);
  const isInView    = useInView(sectionRef);
  const hasEntered  = useInView(sectionRef, { once: true, amount: 0.15 });
  const pageVisible = usePageVisible();
  const isWide      = useIsWide();

  const [hovered,  setHovered]  = useState(false);
  const [paused,   setPaused]   = useState(false);
  const [selected, setSelected] = useState(null);

  const offset   = useMotionValue(0);
  const geometry = isWide ? WIDE_GEOMETRY : NARROW_GEOMETRY;

  // Pause while lightbox is open
  const moving = isInView && pageVisible && !paused && !hovered && !selected;

  useAnimationFrame((_, delta) => {
    if (moving) offset.set(offset.get() + (speed * Math.min(delta, MAX_FRAME_MS)) / 1000);
  });

  const headingLines = t.heading.split('\n');

  return (
    <>
      <section
        ref={sectionRef}
        id="gallery"
        className="cgh-section section"
        aria-label={t.badge}
      >
        {/* ── Text header ─────────────────────────────────────── */}
        <div className="cgh-header">
          <Reveal preset="fade" duration={0.6}>
            <span className="cgh-badge">{t.badge}</span>
          </Reveal>

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

          <Reveal preset="slide-up" distance={16} duration={0.7} delay={0.35}>
            <p className="cgh-desc">{t.desc}</p>
          </Reveal>
        </div>

        {/* ── Carousel ────────────────────────────────────────── */}
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
                    onOpen={setSelected}
                    label={t.view}
                  />
                ))}
              </ul>

              <button
                type="button"
                aria-label={paused ? t.play : t.pause}
                className="cgh-pause-btn"
                onClick={() => setPaused((p) => !p)}
              >
                {paused
                  ? <Play size={16} aria-hidden />
                  : <Pause size={16} aria-hidden />}
              </button>
            </>
          )}
        </div>
      </section>

      {/* ── Lightbox (outside <section> so it escapes overflow:clip) ── */}
      <AnimatePresence>
        {selected && (
          <Lightbox
            item={selected}
            onClose={() => setSelected(null)}
            label={t.close}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default CurvedGalleryHero;
