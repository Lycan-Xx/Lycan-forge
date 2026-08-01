import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, Float, Stars, Sparkles, MeshDistortMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { useReducedMotion, useIsMobile } from '../../utils/motionPreferences';
import { PROJECTS } from '../../constants';
import { 
  ANIMATION_CONFIG, 
  getParticleCount, 
  getSectionProgress,
  EASING 
} from '../../config/animationConfig';

/**
 * BrandLogo - Entry point geometric abstraction
 * Includes proper geometry/material disposal
 */
function BrandLogo() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    return () => {
      // Cleanup geometries and materials on unmount
      if (meshRef.current?.geometry) {
        meshRef.current.geometry.dispose();
      }
      if (meshRef.current?.material) {
        const materials = Array.isArray(meshRef.current.material) 
          ? meshRef.current.material 
          : [meshRef.current.material];
        materials.forEach(m => m.dispose());
      }
    };
  }, []);

  useFrame(() => {
    if (!groupRef.current || !scroll) return;
    if (prefersReduced) return; // Skip animations if user prefers reduced motion
    
    const config = ANIMATION_CONFIG.sections.brand;
    
    // Rotate constantly
    groupRef.current.rotation.y += config.rotationSpeed;

    // Scroll progress 0 -> 0.25: Dolly back
    const p1 = getSectionProgress(scroll.offset, 0, config.end);
    
    // Position z: from 0 to -5
    groupRef.current.position.z = THREE.MathUtils.lerp(0, -5, p1);
    groupRef.current.position.y = THREE.MathUtils.lerp(0, 1, p1);

    // Fade out / shrink at section 2
    const p2 = Math.max(0, (scroll.offset - config.end) / config.end);
    groupRef.current.scale.setScalar(Math.max(0, 1 - p2));
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Abstract representation of logo */}
        <mesh ref={meshRef}>
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

/**
 * CoreValues - Three platform visualization
 */
function CoreValues() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const prefersReduced = useReducedMotion();
  
  // 3 Platforms - memoized
  const platforms = useMemo(() => [
    { pos: [-3, 0, -10] as [number, number, number], rot: [0, 0, 0], color: '#eb5e1e' },
    { pos: [0, 2, -12] as [number, number, number], rot: [0.5, 0.5, 0], color: '#ffffff' },
    { pos: [3, 0, -10] as [number, number, number], rot: [0, 0, 0], color: '#eb5e1e' }
  ], []);

  useFrame(() => {
    if (!groupRef.current || !scroll) return;
    if (prefersReduced) return;
    
    const config = ANIMATION_CONFIG.sections.values;
    const p = getSectionProgress(scroll.offset, config.start, config.end);
    
    // Smooth parabolic visibility curve
    const scale = Math.sin(p * Math.PI);
    const targetScale = new THREE.Vector3(scale, scale, scale);
    
    groupRef.current.scale.lerp(targetScale, 0.1);
    groupRef.current.rotation.y = scroll.offset * Math.PI * 2;
  });

  return (
    <group ref={groupRef}>
      {platforms.map((p, i) => (
        <Float key={i} position={p.pos} speed={ANIMATION_CONFIG.sections.values.floatSpeed + i * 0.5} floatIntensity={ANIMATION_CONFIG.sections.values.floatIntensity}>
          <mesh>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshStandardMaterial color={p.color} wireframe />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

/**
 * ServicesMiniView - Distorted sphere showcase
 */
function ServicesMiniView() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const targetScale = useRef(new THREE.Vector3(0, 0, 0));
  const prefersReduced = useReducedMotion();

  useFrame(() => {
    if (!groupRef.current || !scroll) return;
    if (prefersReduced) return;
    
    const config = ANIMATION_CONFIG.sections.services;
    const p = getSectionProgress(scroll.offset, config.start, config.end);
    
    // Smooth scale with easing
    const scale = EASING.easeInOutQuad(Math.sin(p * Math.PI));
    
    targetScale.current.set(scale, scale, scale);
    groupRef.current.scale.lerp(targetScale.current, 0.1);
    groupRef.current.position.z = THREE.MathUtils.lerp(-20, -5, p);
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, -2, -15]}>
        <sphereGeometry args={[3, 32, 32]} />
        <MeshDistortMaterial color="#eb5e1e" speed={2} distort={0.4} radius={1} />
      </mesh>
    </group>
  );
}

/**
 * GallerySpace - Data-driven portfolio gallery with selection support
 */
function GallerySpace() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const frameRefs = useRef<(THREE.Mesh | null)[]>([]);
  const targetScale = useRef(new THREE.Vector3(0, 0, 0));
  const prefersReduced = useReducedMotion();
  const selectedProjectId = useStore((s) => s.selectedProjectId);
  const setSelectedProject = useStore((s) => s.setSelectedProject);

  const config = ANIMATION_CONFIG.sections.portfolio;
  const frameZ = config.frameZ ?? -3;
  const frameWidth = config.frameWidth ?? 2.6;
  const frameHeight = config.frameHeight ?? 3.6;
  const spacing = config.frameSpacing ?? 3.4;
  const maxVisible = config.maxVisible ?? 7;

  // Build arc positions from the full project list (scales automatically)
  const projects = useMemo(() => PROJECTS.slice(0, maxVisible), []);
  const arcRadius = config.arcRadius ?? 6;

  const positions = useMemo(() => {
    const count = projects.length;
    return projects.map((_, i) => {
      const t = count === 1 ? 0 : (i / (count - 1)) * 2 - 1; // -1..1
      const angle = t * 0.5; // gentle arc
      const x = t * (spacing * (count - 1)) / 2;
      const z = frameZ - Math.abs(t) * (arcRadius * 0.15);
      return new THREE.Vector3(x, 0, z);
    });
  }, [projects, spacing, arcRadius, frameZ]);

  // Shared geometry + material across all frames (lightweight)
  const frameGeometry = useMemo(() => new THREE.PlaneGeometry(frameWidth, frameHeight), [frameWidth, frameHeight]);
  const edgeGeometry = useMemo(() => new THREE.EdgesGeometry(frameGeometry), [frameGeometry]);

  useFrame(() => {
    if (!groupRef.current || !scroll) return;
    if (prefersReduced) return;

    const p = getSectionProgress(scroll.offset, config.start, config.end);
    const scale = Math.sin(p * Math.PI);
    targetScale.current.set(scale, scale, scale);
    groupRef.current.scale.lerp(targetScale.current, 0.1);
    groupRef.current.position.y = THREE.MathUtils.lerp(-8, 1.5, p);

    // Dim non-selected frames, highlight selected
    frameRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const isSelected = projects[i]?.id === selectedProjectId;
      const targetEmissive = isSelected ? 1.4 : (selectedProjectId ? 0.15 : 0.5);
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetEmissive, 0.1);
    });
  });

  return (
    <group ref={groupRef}>
      {projects.map((project, i) => {
        const pos = positions[i];
        const isSelected = project.id === selectedProjectId;
        return (
          <group key={project.id} position={pos.toArray()}>
            <mesh
              ref={(el) => { frameRefs.current[i] = el; }}
              onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
              onPointerOut={() => { document.body.style.cursor = 'default'; }}
              onClick={(e) => { e.stopPropagation(); setSelectedProject(isSelected ? null : project.id); }}
            >
              <primitive object={frameGeometry} attach="geometry" />
              <meshStandardMaterial
                color="#1a1208"
                emissive="#eb5e1e"
                emissiveIntensity={0.5}
                transparent
                opacity={0.85}
                side={THREE.DoubleSide}
                roughness={0.9}
                metalness={0.1}
              />
            </mesh>
            <lineSegments>
              <primitive object={edgeGeometry} attach="geometry" />
              <lineBasicMaterial color={isSelected ? '#ffffff' : '#eb5e1e'} linewidth={2} />
            </lineSegments>
            {/* Project label floating above frame */}
            <Html position={[0, frameHeight / 2 + 0.4, 0]} center distanceFactor={8} occlude={false}>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '11px',
                color: isSelected ? '#ffffff' : '#eb5e1e',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                opacity: 0.8,
                pointerEvents: 'none',
                textShadow: '0 0 8px rgba(235,94,30,0.5)',
              }}>
                {project.name}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

/**
 * Rig - Camera parallax + zoom-to-frame on selection
 */
function Rig() {
  const scroll = useScroll();
  const isMobile = useIsMobile();
  const prefersReduced = useReducedMotion();
  const selectedProjectId = useStore((s) => s.selectedProjectId);
  const { camera } = useThree();
  const zoomTarget = useRef<THREE.Vector3 | null>(null);
  const baseLookAt = useRef(new THREE.Vector3(0, 0, 0));

  const config = ANIMATION_CONFIG.camera;
  const galleryConfig = ANIMATION_CONFIG.sections.portfolio;
  const frameZ = galleryConfig.frameZ ?? -3;
  const spacing = galleryConfig.frameSpacing ?? 3.4;

  // Compute target position when selection changes
  useEffect(() => {
    if (selectedProjectId) {
      const idx = PROJECTS.findIndex(p => p.id === selectedProjectId);
      if (idx >= 0) {
        const count = Math.min(PROJECTS.length, galleryConfig.maxVisible ?? 7);
        const t = count === 1 ? 0 : (idx / (count - 1)) * 2 - 1;
        const x = t * (spacing * (count - 1)) / 2;
        zoomTarget.current = new THREE.Vector3(x * 0.6, 0, frameZ + 4);
      }
    } else {
      zoomTarget.current = null;
    }
  }, [selectedProjectId, frameZ, spacing, galleryConfig.maxVisible]);

  useFrame((state) => {
    if (!scroll) return;

    // Zoom-to-frame takes priority
    if (zoomTarget.current) {
      camera.position.lerp(zoomTarget.current, 0.06);
      camera.lookAt(zoomTarget.current.x * 0.3, 0, frameZ);
      return;
    }

    // Parallax (disabled on mobile / reduced motion)
    if (isMobile || prefersReduced) {
      camera.position.lerp(new THREE.Vector3(0, 0, 10), 0.05);
      camera.lookAt(0, 0, 0);
      return;
    }

    const targetX = THREE.MathUtils.clamp(
      state.pointer.x * config.parallaxMultiplier,
      -config.maxX,
      config.maxX
    );
    const targetY = THREE.MathUtils.clamp(
      state.pointer.y * config.parallaxMultiplier,
      -config.maxY,
      config.maxY
    );

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, config.parallaxLerpSpeed);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, config.parallaxLerpSpeed);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/**
 * Main Scene Component
 */
export default function Scene() {
  const prefersReduced = useReducedMotion();
  const particleCount = useMemo(() => getParticleCount(), []);

  return (
    <>
      <color attach="background" args={[ANIMATION_CONFIG.canvas.clearColor]} />
      
      {/* Lighting Strategy: Dark environment with accent lighting */}
      <ambientLight intensity={ANIMATION_CONFIG.lighting.ambient.intensity} />
      <directionalLight 
        position={ANIMATION_CONFIG.lighting.directional1.position} 
        intensity={ANIMATION_CONFIG.lighting.directional1.intensity}
        color={ANIMATION_CONFIG.lighting.directional1.color}
      />
      <directionalLight 
        position={ANIMATION_CONFIG.lighting.directional2.position} 
        intensity={ANIMATION_CONFIG.lighting.directional2.intensity}
        color={ANIMATION_CONFIG.lighting.directional2.color}
      />
      <pointLight 
        position={ANIMATION_CONFIG.lighting.point.position} 
        intensity={ANIMATION_CONFIG.lighting.point.intensity}
        color={ANIMATION_CONFIG.lighting.point.color}
        distance={ANIMATION_CONFIG.lighting.point.distance}
      />
      
      {/* Background Particles - Adaptive and respects motion preference */}
      {!prefersReduced && (
        <>
          <Stars 
            radius={ANIMATION_CONFIG.particles.stars.radius}
            depth={ANIMATION_CONFIG.particles.stars.depth}
            count={particleCount}
            factor={ANIMATION_CONFIG.particles.stars.factor}
            saturation={ANIMATION_CONFIG.particles.stars.saturation}
            fade
            speed={ANIMATION_CONFIG.particles.stars.speed}
          />
          <Sparkles 
            count={ANIMATION_CONFIG.particles.sparkles.count}
            scale={ANIMATION_CONFIG.particles.sparkles.scale}
            size={ANIMATION_CONFIG.particles.sparkles.size}
            speed={ANIMATION_CONFIG.particles.sparkles.speed}
            opacity={ANIMATION_CONFIG.particles.sparkles.opacity}
            color="#eb5e1e"
          />
        </>
      )}

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
