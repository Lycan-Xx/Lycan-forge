/**
 * Centralized animation configuration
 * Eliminates magic numbers and makes adjustments easier
 */

export const ANIMATION_CONFIG = {
  scroll: {
    pages: 5,
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
      start: 0,
      end: 0.25,
      speed: 0.005,
      rotationSpeed: 0.005,
    },
    values: {
      start: 0.25,
      end: 0.5,
      floatSpeed: 1.5,
      floatIntensity: 2,
    },
    services: {
      start: 0.5,
      end: 0.75,
      speed: 2,
    },
    portfolio: {
      start: 0.75,
      end: 0.95,
      speed: 1,
      frameZ: -3,
      frameWidth: 2.6,
      frameHeight: 3.6,
      frameSpacing: 3.4,
      arcRadius: 6,
      maxVisible: 7,
    },
    cta: {
      start: 0.95,
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
    ambient: { intensity: 0.45 },
    directional1: { 
      position: [5, 4, 6] as [number, number, number], 
      intensity: 0.5, 
      color: '#eb5e1e' 
    },
    directional2: { 
      position: [-4, 2, 3] as [number, number, number], 
      intensity: 0.25, 
      color: '#5a5a7a' 
    },
    point: { 
      position: [0, 0, 6] as [number, number, number], 
      intensity: 0.7, 
      color: '#ffffff', 
      distance: 25 
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
