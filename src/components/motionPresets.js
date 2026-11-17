// ─── Viewport config ──────────────────────────────────────────────────────────
export const revealViewport = {
  once: true,
  amount: 0.16,
};

// Pour les blocs de section entière — se déclenche dès que le bord entre dans le viewport
export const sectionViewport = {
  once: true,
  amount: 0.08,
};

// ─── Éléments internes (titre, carte, item...) ────────────────────────────────
export const reveal = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const indexedReveal = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
      delay: index * 0.06,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export const timelineReveal = {
  hidden: {
    opacity: 0,
    x: -12,
  },
  visible: (index = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.42,
      delay: index * 0.06,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export const stagger = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.04,
      staggerChildren: 0.06,
    },
  },
};

// ─── Animation de bloc de section ─────────────────────────────────────────────
// Le bloc entier monte de 40px + fade in au scroll
export const sectionReveal = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Variante avec slide depuis la gauche — utilisé pour les blocs côte à côte
export const sectionRevealLeft = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Variante avec slide depuis la droite
export const sectionRevealRight = {
  hidden: {
    opacity: 0,
    x: 40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Container qui orchestre l'entrée de ses enfants avec un léger décalage
export const sectionStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};
