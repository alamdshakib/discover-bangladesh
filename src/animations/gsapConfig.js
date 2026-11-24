import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let isRegistered = false;

export const MOTION = {
  ease: 'power3.out',
  slowEase: 'expo.out',
  duration: 0.9,
  stagger: 0.1,
};

export function registerGsap() {
  if (isRegistered) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({
    ease: MOTION.ease,
    duration: MOTION.duration,
  });
  isRegistered = true;
}

export { gsap, ScrollTrigger };
