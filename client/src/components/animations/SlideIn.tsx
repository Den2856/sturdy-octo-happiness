import type { Variants, Transition } from "framer-motion";

const drawerSpring: Transition = {
  type: "spring",
  stiffness: 210,
  damping: 26,
  mass: 0.9,
  restDelta: 0.001,
};


const tweenOut: Transition = { duration: 0.28, ease: "easeOut" };
const tweenIn: Transition  = { duration: 0.22, ease: "easeIn" };

export const press = {
  whileHover: { y: -1, scale: 1.02, transition: { duration: 0.12 } },
  whileTap:   { scale: 0.98, transition: { duration: 0.1 } },
};

export const overlay: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: tweenOut },
  exit:    { opacity: 0, transition: tweenIn },
};

export const drawer: Variants = {
  initial: { x: "100%" },
  animate: { x: 0, transition: drawerSpring },
  exit:    { x: "100%", transition: tweenIn },
};

export const pop: Variants = {
  initial: { opacity: 0, y: 8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: tweenOut },
  exit:    { opacity: 0, y: 8, scale: 0.98, transition: tweenIn },
};


export const slideIn = drawer;
export const fadeIn  = overlay;
export const hoverScale = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap:   { scale: 0.97, transition: { duration: 0.12 } },
};
