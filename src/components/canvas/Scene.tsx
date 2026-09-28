import { useMemo, useRef } from 'react';
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { Image as DreiImage, RoundedBox, useScroll } from '@react-three/drei';
import * as easing from 'maath/easing';
import * as THREE from 'three';
import { PROJECTS } from '../../constants';
import { ANIMATION_CONFIG, getSectionProgress } from '../../config/animationConfig';
import { useIsMobile } from '../../utils/motionPreferences';

interface SceneProps {
  activeProjectId: string;
  onProjectActivate: (projectId: string) => void;
  onProjectOpen: (projectId: string) => void;
}

type Position = [number, number, number];

const clamp01 = (value: number) => Math.max(0, Math.min(value, 1));

function BrandMark() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const section = ANIMATION_CONFIG.sections.brand;
    const progress = getSectionProgress(scroll.offset, section.start, section.end);
    const exit = clamp01((progress - 0.58) / 0.42);

    easing.damp3(groupRef.current.position, [0, progress * 0.65, -progress * 3.5], 0.28, delta);
    easing.damp3(groupRef.current.scale, 1 - exit, 0.2, delta);
    easing.dampE(groupRef.current.rotation, [progress * 0.25, progress * 0.8, progress * 0.08], 0.35, delta);
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.05, 0.08, 16, 72]} />
        <meshStandardMaterial color="#22112e" roughness={0.65} />
      </mesh>
      <mesh scale={0.55}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#f3f1dd" roughness={0.78} />
      </mesh>
    </group>
  );
}

function PrinciplesScene() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const panels = useMemo(() => [
    { position: [-2.7, -0.2, -4.2] as Position, color: '#f3f1dd', rotation: -0.12 },
    { position: [0, 1.15, -5.2] as Position, color: '#dceaf4', rotation: 0.05 },
    { position: [2.7, -0.25, -4.5] as Position, color: '#aabf93', rotation: 0.12 },
  ], []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const section = ANIMATION_CONFIG.sections.values;
    const progress = getSectionProgress(scroll.offset, section.start, section.end);
    const visibility = Math.sin(progress * Math.PI);
    easing.damp3(groupRef.current.scale, visibility, 0.24, delta);
    easing.dampE(groupRef.current.rotation, [0, progress * 0.35, 0], 0.32, delta);
  });

  return (
    <group ref={groupRef} scale={0}>
      {panels.map((panel) => (
        <RoundedBox key={panel.position.join('-')} args={[1.65, 1.95, 0.18]} radius={0.14} position={panel.position} rotation={[0, panel.rotation, 0]}>
          <meshStandardMaterial color={panel.color} roughness={0.9} />
        </RoundedBox>
      ))}
    </group>
  );
}

function CapabilitiesScene() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const section = ANIMATION_CONFIG.sections.services;
    const progress = getSectionProgress(scroll.offset, section.start, section.end);
    const visibility = Math.sin(progress * Math.PI);
    easing.damp3(groupRef.current.scale, visibility, 0.24, delta);
    easing.damp3(groupRef.current.position, [0, -0.4, THREE.MathUtils.lerp(-8, -3.5, progress)], 0.28, delta);
  });

  return (
    <group ref={groupRef} scale={0}>
      <RoundedBox args={[4.6, 2.7, 0.22]} radius={0.22}>
        <meshStandardMaterial color="#f3f1dd" roughness={0.92} />
      </RoundedBox>
      <RoundedBox args={[1.1, 0.75, 0.12]} radius={0.16} position={[-1.35, 0.45, 0.2]}>
        <meshStandardMaterial color="#aabf93" roughness={0.92} />
      </RoundedBox>
      <RoundedBox args={[1.1, 0.75, 0.12]} radius={0.16} position={[0, 0.45, 0.2]}>
        <meshStandardMaterial color="#dceaf4" roughness={0.92} />
      </RoundedBox>
      <RoundedBox args={[1.1, 0.75, 0.12]} radius={0.16} position={[1.35, 0.45, 0.2]}>
        <meshStandardMaterial color="#c7ddb0" roughness={0.92} />
      </RoundedBox>
    </group>
  );
}

function getProjectDimensions(project: typeof PROJECTS[number], isMobile: boolean) {
  if (isMobile) return { width: 3.25, height: 2.2 };
  const width = project.gridSpan.includes('col-span-7') ? 2.85 : 2.55;
  return { width, height: project.height.includes('360') ? 1.75 : 1.95 };
}

function getGalleryLayout(
  viewport: { width: number; height: number },
  isMobile: boolean,
  activeIndex: number,
): Position[] {
  if (isMobile) {
    const spacing = Math.max(3.9, viewport.width * 0.88);
    return PROJECTS.map((_, index) => [
      (index - activeIndex) * spacing,
      -0.15,
      -Math.abs(index - activeIndex) * 1.25,
    ]);
  }

  const x = Math.min(viewport.width * 0.28, 3.65);
  const y = Math.min(viewport.height * 0.2, 1.75);
  return [
    [-x, y * 0.78, -0.55],
    [0, y * 1.05, 0],
    [x, y * 0.45, -0.85],
    [-x * 0.58, -y, -0.1],
    [x * 0.62, -y * 1.04, -0.45],
  ];
}

function FloatingProjectCard({
  project,
  position,
  index,
  galleryReveal,
  active,
  isMobile,
  onActivate,
  onOpen,
}: {
  project: typeof PROJECTS[number];
  position: Position;
  index: number;
  galleryReveal: { current: number };
  active: boolean;
  isMobile: boolean;
  onActivate: () => void;
  onOpen: () => void;
}) {
  const anchorRef = useRef<THREE.Group>(null);
  const interactionRef = useRef<THREE.Group>(null);
  const worldPosition = useRef(new THREE.Vector3());
  const projectedPosition = useRef(new THREE.Vector3());
  const { width, height } = getProjectDimensions(project, isMobile);

  useFrame((state, delta) => {
    if (!anchorRef.current || !interactionRef.current) return;

    const reveal = clamp01((galleryReveal.current - index * 0.035) / 0.84);
    const floatY = Math.sin(state.clock.elapsedTime * 0.72 + index * 1.37) * (isMobile ? 0.045 : 0.085);

    interactionRef.current.getWorldPosition(worldPosition.current);
    projectedPosition.current.copy(worldPosition.current).project(state.camera);
    const dx = state.pointer.x - projectedPosition.current.x;
    const dy = state.pointer.y - projectedPosition.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const proximity = isMobile ? 0 : clamp01(1 - (distance - 0.06) / 0.46) * reveal;

    easing.damp3(
      anchorRef.current.position,
      [position[0], position[1] + floatY * reveal, position[2] + proximity * 0.42 + (1 - reveal) * 4],
      0.2,
      delta,
    );
    easing.dampE(
      interactionRef.current.rotation,
      [-dy * 0.16 * proximity, dx * 0.23 * proximity, -dx * 0.025 * proximity],
      0.16,
      delta,
    );
    easing.damp3(interactionRef.current.scale, reveal * (active ? 1.045 : 0.96), 0.18, delta);
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    const target = event.nativeEvent.target;
    if (target instanceof HTMLElement && target.closest('a, button')) return;
    event.stopPropagation();
    onOpen();
  };

  return (
    <group ref={anchorRef}>
      <group ref={interactionRef} scale={0}>
        <RoundedBox args={[width + 0.2, height + 0.34, 0.12]} radius={0.14} position={[0, -0.08, 0]}>
          <meshStandardMaterial color={active ? '#f3f1dd' : '#e8e9d1'} roughness={0.9} />
        </RoundedBox>
        <DreiImage
          url={project.image}
          scale={[width, height]}
          position={[0, 0.09, 0.08]}
          radius={0.09}
          toneMapped={false}
          color={active ? '#ffffff' : '#d8ddcf'}
          zoom={active ? 1.025 : 1}
          onClick={handleClick}
          onPointerOver={(event) => {
            const target = event.nativeEvent.target;
            if (target instanceof HTMLElement && target.closest('a, button')) return;
            event.stopPropagation();
            document.body.style.cursor = 'pointer';
            onActivate();
          }}
          onPointerMove={(event) => {
            const target = event.nativeEvent.target;
            if (target instanceof HTMLElement && target.closest('a, button')) return;
            event.stopPropagation();
          }}
          onPointerOut={(event) => {
            event.stopPropagation();
            document.body.style.cursor = 'auto';
          }}
        />
      </group>
    </group>
  );
}

function FloatingProjectGallery({ activeProjectId, onProjectActivate, onProjectOpen }: SceneProps) {
  const scroll = useScroll();
  const viewport = useThree((state) => state.viewport);
  const isMobile = useIsMobile();
  const rootRef = useRef<THREE.Group>(null);
  const revealRef = useRef(0);
  const activeIndex = Math.max(0, PROJECTS.findIndex((project) => project.id === activeProjectId));
  const positions = useMemo(
    () => getGalleryLayout(viewport, isMobile, activeIndex),
    [viewport.width, viewport.height, isMobile, activeIndex],
  );

  useFrame((state, delta) => {
    const section = ANIMATION_CONFIG.sections.gallery;
    const enter = getSectionProgress(scroll.offset, section.start, section.start + 0.075);
    const exit = getSectionProgress(scroll.offset, section.end - 0.035, section.end);
    const visibility = enter * (1 - exit);
    revealRef.current = THREE.MathUtils.damp(revealRef.current, visibility, 7, delta);

    if (rootRef.current) rootRef.current.visible = revealRef.current > 0.004;
    if (visibility > 0.001 || revealRef.current > 0.005) state.invalidate();
  });

  return (
    <group ref={rootRef} visible={false}>
      {PROJECTS.map((project, index) => (
        <FloatingProjectCard
          key={project.id}
          project={project}
          position={positions[index]}
          index={index}
          galleryReveal={revealRef}
          active={project.id === activeProjectId}
          isMobile={isMobile}
          onActivate={() => onProjectActivate(project.id)}
          onOpen={() => onProjectOpen(project.id)}
        />
      ))}
    </group>
  );
}

function CameraRig() {
  const scroll = useScroll();
  const isMobile = useIsMobile();

  useFrame((state, delta) => {
    if (isMobile) return;
    const gallery = getSectionProgress(scroll.offset, ANIMATION_CONFIG.sections.gallery.start, ANIMATION_CONFIG.sections.gallery.end);
    const targetX = gallery > 0 ? 0 : THREE.MathUtils.clamp(state.pointer.x * 0.45, -0.6, 0.6);
    const targetY = gallery > 0 ? 0 : THREE.MathUtils.clamp(state.pointer.y * 0.3, -0.4, 0.4);
    const moving = Math.abs(state.camera.position.x - targetX) > 0.001 || Math.abs(state.camera.position.y - targetY) > 0.001;

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX, 5, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, 5, delta);
    state.camera.lookAt(0, 0, 0);
    if (moving) state.invalidate();
  });

  return null;
}

export default function Scene(props: SceneProps) {
  return (
    <>
      <ambientLight intensity={1.15} color="#f6f2df" />
      <hemisphereLight args={['#dceaf4', '#94aa80', 1.3]} />
      <directionalLight position={[5, 7, 8]} intensity={1.2} color="#fffaf0" />

      <CameraRig />
      <BrandMark />
      <PrinciplesScene />
      <CapabilitiesScene />
      <FloatingProjectGallery {...props} />
    </>
  );
}
