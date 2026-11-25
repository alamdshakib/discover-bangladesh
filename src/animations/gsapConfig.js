import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

let isRegistered = false;

export const MOTION = {
  ease: 'power3.out',
  slowEase: 'expo.out',
  duration: 0.9,
  stagger: 0.08,
};

/** Shared breakpoints for gsap.matchMedia() — keep in sync with Tailwind `lg`. */
export const MEDIA = {
  desktop: '(min-width: 1024px)',
  mobile: '(max-width: 1023.98px)',
  motion: '(prefers-reduced-motion: no-preference)',
  reduceMotion: '(prefers-reduced-motion: reduce)',
};

export function registerGsap() {
  if (isRegistered) return;
  gsap.registerPlugin(ScrollTrigger, Flip);
  gsap.defaults({ ease: MOTION.ease, duration: MOTION.duration });
  ScrollTrigger.config({ ignoreMobileResize: true });
  isRegistered = true;
}

export { gsap, ScrollTrigger, Flip };
