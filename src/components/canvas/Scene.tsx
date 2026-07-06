import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, Float, Stars, Sparkles, MeshDistortMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
// ChromaticAberration + BlendFunction disabled for now — see PostFX below.
// Re-add both imports if you turn it back on.
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
 * NOTE: requires @react-three/postprocessing + postprocessing
 *   npm install @react-three/postprocessing postprocessing
 */

/**
 * BrandLogo - Entry point geometric abstraction
 * Includes proper geometry/material disposal.
 * Left mounted for reduced-motion users too — its default (unanimated)
 * transform is identity, which is the correct "resting" pose, and it
 * matches the fact that HtmlOverlay's brand section is the only one
 * visible by default for reduced-motion.
 */
function BrandLogo() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    return () => {
      if (meshRef.current?.geometry) {
        meshRef.current.geometry.dispose();
      }
      if (meshRef.current?.material) {
        const materials = Array.isArray(meshRef.current.material)
          ? meshRef.current.material
          : [meshRef.current.material];
        materials.forEach((m) => m.dispose());
      }
    };
  }, []);

  useFrame(() => {
    if (!groupRef.current || !scroll) return;
    if (prefersReduced) return;

    const config = ANIMATION_CONFIG.sections.brand;

    groupRef.current.rotation.y += config.rotationSpeed;

    const p1 = getSectionProgress(scroll.offset, 0, config.end);
    groupRef.current.position.z = THREE.MathUtils.lerp(0, -5, p1);
    groupRef.current.position.y = THREE.MathUtils.lerp(0, 1, p1);

    const p2 = Math.max(0, (scroll.offset - config.end) / config.end);
    groupRef.current.scale.setScalar(Math.max(0, 1 - p2));
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
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
 * Scroll-revealed via a parabolic scale curve (starts at 0, peaks at 1,
 * returns to 0). Only makes sense to mount when scroll-driven animation
 * is actually running.
 */
function CoreValues() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  const platforms = useMemo(
    () => [
      { pos: [-3, 0, -10] as [number, number, number], color: '#eb5e1e' },
      { pos: [0, 2, -12] as [number, number, number], color: '#ffffff' },
      { pos: [3, 0, -10] as [number, number, number], color: '#eb5e1e' }
    ],
    []
  );

  useFrame(() => {
    if (!groupRef.current || !scroll) return;

    const config = ANIMATION_CONFIG.sections.values;
    const p = getSectionProgress(scroll.offset, config.start, config.end);

    const scale = Math.sin(p * Math.PI);
    const targetScale = new THREE.Vector3(scale, scale, scale);

    groupRef.current.scale.lerp(targetScale, 0.1);
    groupRef.current.rotation.y = scroll.offset * Math.PI * 2;
  });

  return (
    <group ref={groupRef} scale={0}>
      {platforms.map((p, i) => (
        <Float
          key={i}
          position={p.pos}
          speed={ANIMATION_CONFIG.sections.values.floatSpeed + i * 0.5}
          floatIntensity={ANIMATION_CONFIG.sections.values.floatIntensity}
        >
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

  useFrame(() => {
    if (!groupRef.current || !scroll) return;

    const config = ANIMATION_CONFIG.sections.services;
    const p = getSectionProgress(scroll.offset, config.start, config.end);

    const scale = EASING.easeInOutQuad(Math.sin(p * Math.PI));

    targetScale.current.set(scale, scale, scale);
    groupRef.current.scale.lerp(targetScale.current, 0.1);
    groupRef.current.position.z = THREE.MathUtils.lerp(-20, -5, p);
  });

  return (
    <group ref={groupRef} scale={0}>
      <mesh position={[0, -2, -15]}>
        <sphereGeometry args={[3, 32, 32]} />
        <MeshDistortMaterial color="#eb5e1e" speed={2} distort={0.4} radius={1} />
      </mesh>
    </group>
  );
}

/**
 * GallerySpace - Portfolio section with textured project planes
 */
function GallerySpace() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const targetScale = useRef(new THREE.Vector3(0, 0, 0));
  
  // Use first 3 projects for the 3 planes
  const displayProjects = useMemo(() => PROJECTS.slice(0, 3), []);

  useFrame(() => {
    if (!groupRef.current || !scroll) return;

    const config = ANIMATION_CONFIG.sections.portfolio;
    const p = getSectionProgress(scroll.offset, config.start, config.end);

    const scale = Math.sin(p * Math.PI);
    targetScale.current.set(scale, scale, scale);

    groupRef.current.scale.lerp(targetScale.current, 0.1);
    groupRef.current.position.y = THREE.MathUtils.lerp(-10, 2, p);
  });

  return (
    <group ref={groupRef} scale={0}>
      {displayProjects.map((project, i) => {
        const xPositions = [-4, 0, 4];
        return (
          <ProjectPlane key={project.id} project={project} position={xPositions[i]} />
        );
      })}
    </group>
  );
}

/**
 * ProjectPlane - Individual project card as a textured plane
 */
function ProjectPlane({ project, position }: { project: typeof PROJECTS[0]; position: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const textureRef = useRef<THREE.Texture | null>(null);

  useEffect(() => {
    // Load texture using TextureLoader
    const loader = new THREE.TextureLoader();
    loader.load(
      project.image,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        textureRef.current = texture;
        if (meshRef.current?.material && !Array.isArray(meshRef.current.material)) {
          const mat = meshRef.current.material as THREE.MeshStandardMaterial;
          mat.map = texture;
          mat.needsUpdate = true;
        }
      },
      undefined,
      () => console.warn(`Failed to load texture for ${project.id}`)
    );

    return () => {
      if (textureRef.current) {
        textureRef.current.dispose();
      }
    };
  }, [project.image, project.id]);

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current) return;

    // Subtle rotation following mouse position
    const mouseX = state.pointer.x;
    const mouseY = state.pointer.y;

    groupRef.current.rotation.y = mouseX * 0.3;
    groupRef.current.rotation.x = mouseY * 0.2;
  });

  useEffect(() => {
    return () => {
      if (meshRef.current?.geometry) {
        meshRef.current.geometry.dispose();
      }
      if (meshRef.current?.material) {
        const materials = Array.isArray(meshRef.current.material)
          ? meshRef.current.material
          : [meshRef.current.material];
        materials.forEach((m) => {
          m.dispose();
          if ('map' in m && m.map) (m.map as THREE.Texture).dispose();
        });
      }
    };
  }, []);

  return (
    <group ref={groupRef} position={[position, 0, -8]}>
      <mesh ref={meshRef}>
        <planeGeometry args={[3, 4]} />
        <meshStandardMaterial
          color="#ffffff"
          toneMapped={false}
          side={THREE.DoubleSide}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* Optional: Glowing wireframe edge */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(3, 4)]} />
        <lineBasicMaterial color="#eb5e1e" linewidth={2} />
      </lineSegments>
    </group>
  );
}

/**
 * Rig - Camera parallax controller with mobile safety
 */
function Rig() {
  const scroll = useScroll();
  const isMobile = useIsMobile();
  const prefersReduced = useReducedMotion();

  useFrame((state) => {
    if (!scroll || isMobile || prefersReduced) {
      return;
    }

    const config = ANIMATION_CONFIG.camera;

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

    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      targetX,
      config.parallaxLerpSpeed
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      targetY,
      config.parallaxLerpSpeed
    );

    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

/**
 * PostFX — bloom + vignette + subtle chromatic aberration.
 * Skipped entirely for reduced-motion (no scroll-driven scene to
 * accent, and it's pure GPU cost with no functional purpose there).
 * Multisampling drops on mobile to keep frame cost down.
 */
function PostFX() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={1.1}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.8}
        resolutionScale={0.5}
      />
      {/* ChromaticAberration disabled for now — smallest visual payoff of
          the three effects, cut first while diagnosing perf, add back last */}
      {/* <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.0008, 0.0008)}
      /> */}
      <Vignette eskil={false} offset={0.25} darkness={0.9} />
    </EffectComposer>
  );
}

/**
 * Main Scene Component
 */
export default function Scene() {
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
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

      {/* Scroll-revealed elements: skipped for reduced-motion since their
          resting state (fully scaled/visible) would otherwise overlap
          the brand logo instead of progressively revealing */}
      {!prefersReduced && (
        <>
          <CoreValues />
          <ServicesMiniView />
          <GallerySpace />
        </>
      )}

      {/* Grid Floor for depth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, -10]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#eb5e1e" wireframe transparent opacity={0.05} />
      </mesh>

      {!prefersReduced && !isMobile && <PostFX />}
    </>
  );
}