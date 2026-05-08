import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, Float, Stars, Sparkles, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

function BrandLogo() {
  const scroll = useScroll();
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current || !scroll) return;
    
    // Rotate constantly
    ref.current.rotation.y += 0.005;

    // Scroll progress 0 -> 0.25: Dolly back
    const p1 = Math.min(scroll.offset / 0.25, 1);
    
    // Position z: from 0 to -5
    ref.current.position.z = THREE.MathUtils.lerp(0, -5, p1);
    ref.current.position.y = THREE.MathUtils.lerp(0, 1, p1);

    // Fade out / shrink at section 2
    const p2 = Math.max(0, Math.min((scroll.offset - 0.25) / 0.25, 1));
    ref.current.scale.setScalar(1 - p2);
  });

  return (
    <group ref={ref}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Abstract representation of logo */}
        <mesh>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#eb5e1e" wireframe />
        </mesh>
        <mesh scale={0.5}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.8} />
        </mesh>
      </Float>
    </group>
  );
}

function CoreValues() {
  const scroll = useScroll();
  const ref = useRef<THREE.Group>(null);
  
  // 3 Platforms
  const platforms = useMemo(() => [
    { pos: [-3, 0, -10], rot: [0, 0, 0], color: '#eb5e1e' },
    { pos: [0, 2, -12], rot: [0.5, 0.5, 0], color: '#ffffff' },
    { pos: [3, 0, -10], rot: [0, 0, 0], color: '#eb5e1e' }
  ], []);

  useFrame(() => {
    if (!ref.current || !scroll) return;
    
    // Appear at 0.25, peak at 0.375, disappear at 0.5
    const p = scroll.offset;
    let scale = 0;
    
    if (p > 0.15 && p < 0.6) {
      // parabolic curve measuring intensity
      scale = Math.sin(((p - 0.15) / 0.45) * Math.PI);
    }
    
    ref.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    ref.current.rotation.y = p * Math.PI * 2;
  });

  return (
    <group ref={ref} visible={false} onUpdate={(self) => (self.visible = true)}>
      {platforms.map((p, i) => (
        <Float key={i} position={p.pos as [number, number, number]} speed={1.5 + i} floatIntensity={2}>
          <mesh>
             <boxGeometry args={[1.5, 1.5, 1.5]} />
             <meshStandardMaterial color={p.color} wireframe />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function ServicesMiniView() {
  const scroll = useScroll();
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current || !scroll) return;
    
    const p = scroll.offset;
    let scale = 0;
    
    if (p > 0.4 && p < 0.8) {
      scale = Math.sin(((p - 0.4) / 0.4) * Math.PI);
    }
    
    ref.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    ref.current.position.z = THREE.MathUtils.lerp(-20, -5, (p - 0.4) / 0.4);
  });

  return (
    <group ref={ref}>
       <mesh position={[0, -2, -15]}>
         <sphereGeometry args={[3, 32, 32]} />
         <MeshDistortMaterial color="#eb5e1e" speed={2} distort={0.4} radius={1} />
       </mesh>
    </group>
  );
}

function GallerySpace() {
  const scroll = useScroll();
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current || !scroll) return;
    
    const p = scroll.offset;
    let scale = 0;
    
    if (p > 0.65 && p < 0.95) {
      scale = Math.sin(((p - 0.65) / 0.3) * Math.PI);
    }
    
    ref.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    ref.current.position.y = THREE.MathUtils.lerp(-10, 2, (p - 0.65) / 0.3);
  });

  return (
    <group ref={ref}>
      {[-4, 0, 4].map((x, i) => (
        <mesh key={i} position={[x, 0, -8]}>
          <planeGeometry args={[3, 4]} />
          <meshStandardMaterial color="#2d1b11" opacity={0.8} transparent side={THREE.DoubleSide} />
          {/* Frame border */}
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(3, 4)]} />
            <lineBasicMaterial color="#eb5e1e" />
          </lineSegments>
        </mesh>
      ))}
    </group>
  );
}

function Rig() {
  const scroll = useScroll();
  const setScrollProgress = useStore((state) => state.setScrollProgress);

  useFrame((state) => {
    if (scroll) {
      setScrollProgress(scroll.offset);
      
      // Camera parallax based on mouse
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, (state.pointer.x * 2), 0.05);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, (state.pointer.y * 2), 0.05);
      // Keep camera looking at center
      state.camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

export default function Scene() {
  return (
    <>
      <color attach="background" args={['#050505']} />
      
      {/* Lighting Strategy: Dark environment with accent lighting */}
      <ambientLight intensity={0.1} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#eb5e1e" />
      <directionalLight position={[-10, 0, -5]} intensity={1} color="#4f46e5" />
      <pointLight position={[0, -2, -5]} intensity={2} color="#ffffff" distance={10} />
      
      {/* Background Particles */}
      <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={150} scale={20} size={1.5} speed={0.4} opacity={0.6} color="#eb5e1e" />

      <Rig />
      
      {/* Narrative Elements */}
      <BrandLogo />
      <CoreValues />
      <ServicesMiniView />
      <GallerySpace />
      
      {/* Grid Floor for depth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, -10]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#eb5e1e" wireframe transparent opacity={0.05} />
      </mesh>
    </>
  );
}
