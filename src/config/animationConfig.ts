/**
 * Centralized animation configuration
 * Eliminates magic numbers and makes adjustments easier
 */
import { PROJECTS } from '../constants';

/**
 * Scroll geometry, measured in "pages" (1 page = one viewport height of scrolling).
 *
 *   0 .. 4            hero, principles, capabilities, work transition (1 page each)
 *   galleryStart ..   the pinned project stage: one page of scroll per project step,
 *                     plus a short dwell on the last project before it releases
 *   ctaStart          "Ready to build?" arrives as the stage scrolls away
 *
 * Everything below is derived from the project count, so adding or removing a project
 * automatically lengthens or shortens the pinned stage and keeps the 3D scene synced.
 */
export function createScrollLayout(projectCount: number) {
  const count = Math.max(projectCount, 1);
  const leadPages = 4;
  const travel = count - 1; // pages of scroll between the first and last project
  const endDwell = 0.4; // extra pages the last project stays pinned
  const pin = travel + endDwell; // total pages the stage stays pinned
  const galleryStart = leadPages;
  const pinEnd = galleryStart + pin;
  const ctaStart = pinEnd + 1; // the released stage needs one page to scroll out
  return {
    count,
    travel,
    pin,
    galleryStart,
    pinEnd,
    ctaStart,
    sectionPages: 1 + pin, // height of the gallery section in pages
    pages: ctaStart + 1, // value for <ScrollControls pages>
  };
}

export const SCROLL_LAYOUT = createScrollLayout(PROJECTS.length);

/** Convert a scroll position in pages to ScrollControls' 0..1 offset. */
const at = (page: number) => page / (SCROLL_LAYOUT.pages - 1);

export const ANIMATION_CONFIG = {
  scroll: {
    pages: SCROLL_LAYOUT.pages,
    damping: 0.25,
    distance: 1,
  },
  
  canvas: {
    camera: {
      position: [0, 0, 10] as [number, number, number],
      fov: 45,
    },
    clearColor: '#050505',
  },
  
  particles: {
    stars: {
      mobile: 300,
      tablet: 600,
      desktop: 1000,
      radius: 50,
      depth: 50,
      factor: 4,
      saturation: 0,
      speed: 0.5,
    },
    sparkles: {
      count: 50,
      scale: 20,
      size: 1,
      speed: 0.2,
      opacity: 0.4,
    },
  },
  
  sections: {
    brand: {
      start: at(0),
      end: at(0.8),
      speed: 0.005,
      rotationSpeed: 0.005,
    },
    values: {
      start: at(0.8),
      end: at(1.7),
      floatSpeed: 1.5,
      floatIntensity: 2,
    },
    services: {
      start: at(1.7),
      end: at(2.6),
      speed: 2,
    },
    portfolio: {
      start: at(2.6),
      end: at(3.3),
      speed: 1,
    },
    gallery: {
      start: at(3.3),
      end: at(SCROLL_LAYOUT.ctaStart),
    },
    cta: {
      start: at(SCROLL_LAYOUT.pinEnd + 0.5),
      end: 1.0,
    },
  },
  
  camera: {
    parallaxMultiplier: 2,
    parallaxLerpSpeed: 0.05,
    maxX: 3,
    maxY: 2,
  },
  
  lighting: {
    ambient: { intensity: 0.1 },
    directional1: { 
      position: [10, 10, 5] as [number, number, number], 
      intensity: 2, 
      color: '#22112e'
    },
    directional2: { 
      position: [-10, 0, -5] as [number, number, number], 
      intensity: 1, 
      color: '#4f46e5' 
    },
    point: { 
      position: [0, -2, -5] as [number, number, number], 
      intensity: 2, 
      color: '#ffffff', 
      distance: 10 
    },
  },
  
  galleryLighting: {
    ambient: { intensity: 0.6, color: '#ffffff' },
    key: {
      position: [0, 0, 10] as [number, number, number],
      intensity: 0.8,
      color: '#ffffff'
    },
    fill: {
      position: [5, 5, 5] as [number, number, number],
      intensity: 0.3,
      color: '#f0f0ff'
    },
  },
};

/**
 * Get adaptive particle count based on device
 */
export function getParticleCount() {
  if (typeof window === 'undefined') return ANIMATION_CONFIG.particles.stars.desktop;
  
  const width = window.innerWidth;
  if (width < 640) return ANIMATION_CONFIG.particles.stars.mobile;
  if (width < 1024) return ANIMATION_CONFIG.particles.stars.tablet;
  return ANIMATION_CONFIG.particles.stars.desktop;
}

/**
 * Get optimal device pixel ratio
 */
export function getOptimalDPR() {
  if (typeof window === 'undefined') return 1;
  
  const dpr = window.devicePixelRatio;
  if (dpr >= 3) return 2; // cap 3x+ at 2x for performance
  if (dpr >= 2) return Math.min(dpr, 2);
  return 1;
}

/**
 * Easing functions for smooth animations
 */
export const EASING = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * (t - 2)) * (2 * (t - 2)) + 1,
};

/**
 * Helper to get progress within a section
 */
export function getSectionProgress(scrollOffset: number, start: number, end: number): number {
  return Math.max(0, Math.min((scrollOffset - start) / (end - start), 1));
}
