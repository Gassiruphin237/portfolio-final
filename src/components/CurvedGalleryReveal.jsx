/**
 * Lightweight Reveal for CurvedGalleryHero.
 * Implements only the three presets used: "fade", "blur", "slide-up".
 * Mirrors the blueprint's reveal.tsx API subset (sha256 982308b6…).
 */
import { motion } from 'motion/react';

const EASE_EXPO = [0.16, 1, 0.3, 1];

function buildVariants(preset, distance = 32, duration = 0.6, delay = 0, ease = EASE_EXPO) {
  const transition = { duration, ease, delay };

  if (preset === 'blur') {
    return {
      hidden: { opacity: 0, filter: 'blur(12px)' },
      visible: { opacity: 1, filter: 'blur(0px)', transition },
    };
  }

  if (preset === 'slide-up') {
    return {
      hidden: { opacity: 0, y: distance },
      visible: { opacity: 1, y: 0, transition },
    };
  }

  // "fade" — default
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition },
  };
}

/**
 * @param {{
 *   as?: string,
 *   preset?: 'fade' | 'blur' | 'slide-up',
 *   distance?: number,
 *   duration?: number,
 *   delay?: number,
 *   className?: string,
 *   children: React.ReactNode,
 * }} props
 */
export function Reveal({
  as = 'div',
  preset = 'fade',
  distance = 32,
  duration = 0.6,
  delay = 0,
  className,
  children,
  ...rest
}) {
  const variants = buildVariants(preset, distance, duration, delay);
  const Tag = motion[as] ?? motion.div;

  return (
    <Tag
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}
