import type { Variants } from 'framer-motion';

// ─────────────────────────────────────────────
// Reusable Framer Motion variants
// ─────────────────────────────────────────────

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

// Staggered container — children animate with delay offset
export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren, delayChildren },
  },
});

// Card hover lift
export const cardHover = {
  rest: { y: 0 },
  hover: {
    y: -4,
    transition: { duration: 0.25, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  },
};

// Button press
export const buttonTap = { scale: 0.97 };

// Slide in from bottom (mobile drawer/panel)
export const slideInBottom: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] } },
  exit: { y: '100%', opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } },
};

// Slide in from right (mobile menu)
export const slideInRight: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] } },
  exit: { x: '100%', opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } },
};

// Overlay backdrop
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// Number counter (used for stats)
export const counterVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// Viewport trigger settings
export const viewportOnce = { once: true, margin: '-80px' };
