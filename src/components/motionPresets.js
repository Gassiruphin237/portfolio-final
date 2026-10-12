export const revealViewport = {
  once: true,
  amount: 0.16,
};

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
