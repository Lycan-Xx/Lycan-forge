import { useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import Scene from '../components/canvas/Scene';
import HtmlOverlay from '../components/home3D/HtmlOverlay';
import { useStore } from '../store/useStore';
import { motion } from 'motion/react';
import { Icon } from '@iconify/react';

function Loader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] z-50 text-white">
      <Icon icon="mdi:code-braces" className="w-12 h-12 text-accent animate-pulse mb-6" />
      <div className="w-48 h-1 bg-bg-border rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="h-full bg-accent"
        />
      </div>
    </div>
  );
}

export default function Home() {
  const setIsHome = useStore((state) => state.setIsHome);

  useEffect(() => {
    setIsHome(true);
    return () => setIsHome(false);
  }, [setIsHome]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 w-full h-full bg-[#050505] overflow-hidden"
    >
      <Suspense fallback={<Loader />}>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 45 }}
          dpr={Math.min(window.devicePixelRatio, 2)}
          gl={{ antialias: true, alpha: false }}
        >
          <ScrollControls pages={5} damping={0.25} distance={1}>
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
