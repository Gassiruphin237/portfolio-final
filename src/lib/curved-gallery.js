/**
 * Curved gallery geometry math.
 * Ported from blueprint src/lib/animation/curved-gallery.ts (sha256 2f4084a5…).
 * Treated as untrusted data — content verified against manifest digest before writing.
 */

const FADE_SLOTS = 0.75;

/**
 * @param {number} index
 * @param {number} count
 * @param {number} offset
 * @returns {number}
 */
export function getCurvedGalleryPosition(index, count, offset) {
  const span = Math.max(count, 1);
  const wrapped = (((index - offset) % span) + span) % span;
  return wrapped >= span / 2 ? wrapped - span : wrapped;
}

/**
 * @param {number} position
 * @param {{ radius: number, stepDegrees: number, visibleSlots: number }} geometry
 * @returns {{ transform: string, opacity: number, zIndex: number }}
 */
export function getCurvedGalleryPose(position, geometry) {
  const angle = (position * geometry.stepDegrees * Math.PI) / 180;
  const x = geometry.radius * Math.sin(angle);
  const z = geometry.radius * (1 - Math.cos(angle));
  const rotateY = -position * geometry.stepDegrees;
  const distance = Math.abs(position);
  const fade = Math.min(
    1,
    Math.max(0, (geometry.visibleSlots + FADE_SLOTS - distance) / FADE_SLOTS),
  );

  return {
    transform: `translateX(-50%) translateX(${x.toFixed(3)}cqw) translateZ(${z.toFixed(3)}cqw) rotateY(${rotateY.toFixed(3)}deg)`,
    opacity: fade,
    zIndex: Math.round(distance * 10),
  };
}
