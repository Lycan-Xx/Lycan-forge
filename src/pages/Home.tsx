import { useCallback, useEffect, Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import Scene from '../components/canvas/Scene';
import HtmlOverlay from '../components/home3D/HtmlOverlay';
import { useStore } from '../store/useStore';
import { motion } from 'motion/react';
import { canvasSupported, useReducedMotion } from '../utils/motionPreferences';
import { ANIMATION_CONFIG, getOptimalDPR } from '../config/animationConfig';
import { PROJECTS } from '../constants';
import { useNavigate } from 'react-router-dom';

/**
 * Accessible Loader Component
 */
function Loader() {
  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-bg-surface z-50 text-text-primary"
      role="status"
      aria-live="polite"
      aria-label="Page loading - immersive experience preparing"
    >
      <span className="mb-6 font-mono text-4xl font-medium text-accent" aria-hidden="true">{'{ }'}</span>
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
function StaticLanding({
  activeProjectId,
  onProjectActivate,
  message,
}: {
  activeProjectId: string;
  onProjectActivate: (projectId: string) => void;
  message: string;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky via-bg-surface to-bg-base">
      <p className="fixed right-4 top-4 z-10 rounded-full border border-bg-border bg-bg-base/90 px-3 py-2 text-xs text-text-secondary backdrop-blur-sm">
        {message}
      </p>
      <HtmlOverlay variant="static" activeProjectId={activeProjectId} onProjectActivate={onProjectActivate} />
    </div>
  );
}

/**
 * Home Page Component
 */
export default function Home() {
  const navigate = useNavigate();
  const setIsHome = useStore((state) => state.setIsHome);
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [height, setHeight] = useState<string>('100vh');
  const prefersReduced = useReducedMotion();
  const [activeProjectId, setActiveProjectId] = useState(PROJECTS[0].id);
  const activateProject = useCallback((projectId: string) => setActiveProjectId(projectId), []);
  const openProject = useCallback((projectId: string) => navigate(`/work/${projectId}`), [navigate]);

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

  if (hasWebGL === null) {
    return <div className="fixed inset-0 bg-bg-surface"><Loader /></div>;
  }

  if (!hasWebGL || prefersReduced) {
    return (
      <StaticLanding
        activeProjectId={activeProjectId}
        onProjectActivate={activateProject}
        message={prefersReduced ? 'Motion reduced by your browser preference' : 'Interactive canvas unavailable'}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 w-full overflow-hidden bg-gradient-to-b from-sky via-[#e8eedb] to-bg-base"
      style={{ height }}
    >
      <Suspense fallback={<Loader />}>
        <Canvas
          camera={{ 
            position: ANIMATION_CONFIG.canvas.camera.position, 
            fov: ANIMATION_CONFIG.canvas.camera.fov 
          }}
          dpr={[1, Math.min(getOptimalDPR(), 1.5)]}
          frameloop="demand"
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: 'high-performance'
          }}
          performance={{ min: 0.5 }}
        >
          <ScrollControls 
            pages={ANIMATION_CONFIG.scroll.pages} 
            damping={ANIMATION_CONFIG.scroll.damping}
            distance={ANIMATION_CONFIG.scroll.distance}
          >
            <Scene activeProjectId={activeProjectId} onProjectOpen={openProject} />
            <Scroll html style={{ width: '100%', height: '100%' }}>
              <HtmlOverlay variant="scroll" activeProjectId={activeProjectId} onProjectActivate={activateProject} />
            </Scroll>
          </ScrollControls>
        </Canvas>
      </Suspense>
    </motion.div>
  );
}
