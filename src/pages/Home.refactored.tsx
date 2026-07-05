import { useEffect, Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import Scene from '../components/canvas/Scene';
import HtmlOverlay from '../components/home3D/HtmlOverlay';
import { useStore } from '../store/useStore';
import { motion } from 'motion/react';
import { Icon } from '@iconify/react';
import { canvasSupported, useReducedMotion } from '../utils/motionPreferences';
import { ANIMATION_CONFIG, getOptimalDPR } from '../config/animationConfig';

/**
 * Accessible Loader Component
 */
function Loader() {
  const prefersReduced = useReducedMotion();

  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] z-50 text-white"
      role="status"
      aria-live="polite"
      aria-label="Page loading - immersive experience preparing"
    >
      <Icon icon="mdi:code-braces" className="w-12 h-12 text-accent mb-6" aria-hidden="true" />
      <div className="w-48 h-1 bg-bg-border rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="h-full bg-accent"
          aria-hidden="true"
        />
      </div>
      <p className="mt-4 text-text-secondary text-sm">Loading immersive experience...</p>
    </div>
  );
}

/**
 * Fallback for unsupported browsers
 */
function WebGLUnsupported() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 w-full h-full bg-[#050505] flex items-center justify-center"
    >
      <div className="text-center space-y-8 px-6">
        <div>
          <h1 className="text-5xl md:text-7xl font-display text-white mb-4">
            Modern Browser Required
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl">
            This immersive experience requires WebGL support. Please update your browser to view this site.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-text-muted text-sm">Supported browsers:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {['Chrome', 'Firefox', 'Safari', 'Edge'].map(browser => (
              <span key={browser} className="nav-pill">{browser}</span>
            ))}
          </div>
        </div>

        <a href="/work" className="cta-pill inline-flex items-center gap-3 hover:shadow-lg transition-all">
          <Icon icon="material-symbols:arrow-right-alt-rounded" className="w-5 h-5" />
          View Our Work
        </a>
      </div>
    </motion.div>
  );
}

/**
 * Home Page Component
 */
export default function Home() {
  const setIsHome = useStore((state) => state.setIsHome);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [height, setHeight] = useState<string>('100vh');
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    setIsHome(true);
    return () => setIsHome(false);
  }, [setIsHome]);

  // Check WebGL support
  useEffect(() => {
    setHasWebGL(canvasSupported());
  }, []);

  // Handle mobile keyboard viewport changes
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        setHeight(`${window.visualViewport.height}px`);
      }
    };
    
    window.visualViewport?.addEventListener('resize', handleResize);
    handleResize(); // Set initial height
    
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, []);

  if (!hasWebGL) {
    return <WebGLUnsupported />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 w-full overflow-hidden bg-[#050505]"
      style={{ height }}
    >
      <Suspense fallback={<Loader />}>
        <Canvas
          camera={{ 
            position: ANIMATION_CONFIG.canvas.camera.position, 
            fov: ANIMATION_CONFIG.canvas.camera.fov 
          }}
          dpr={getOptimalDPR()}
          gl={{ 
            antialias: true, 
            alpha: false,
            powerPreference: 'high-performance'
          }}
          performance={{ min: 0.5 }}
        >
          <ScrollControls 
            pages={ANIMATION_CONFIG.scroll.pages} 
            damping={ANIMATION_CONFIG.scroll.damping}
            distance={ANIMATION_CONFIG.scroll.distance}
          >
            <Scene />
            <Scroll html style={{ width: '100%' }}>
              <HtmlOverlay />
            </Scroll>
          </ScrollControls>
        </Canvas>
      </Suspense>
    </motion.div>
  );
}
