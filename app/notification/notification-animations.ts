import type { Variants } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.25 } },
};
