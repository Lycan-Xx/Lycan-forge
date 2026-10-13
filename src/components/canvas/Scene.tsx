import { useMemo, useRef } from 'react';
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { Image as DreiImage, RoundedBox, useScroll } from '@react-three/drei';
import * as easing from 'maath/easing';
import * as THREE from 'three';
import { PROJECTS } from '../../constants';
import { ANIMATION_CONFIG, getSectionProgress } from '../../config/animationConfig';
import { getGalleryState } from '../../utils/gallerySequence';
import { useIsMobile } from '../../utils/motionPreferences';

interface SceneProps {
  activeProjectId: string;
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

interface TrackLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  /** World-space distance between consecutive project cards on the vertical track. */
  spacing: number;
}

/**
 * Cards ride a single vertical track. Desktop: the track sits in the right half of the
 * screen, opposite the pinned DOM column. Mobile: centred, above the details bar.
 */
function getTrackLayout(viewport: { width: number; height: number }, isMobile: boolean): TrackLayout {
  if (isMobile) {
    const width = Math.min(viewport.width * 0.88, 4.4);
    // Short travel + crossfade: the band between the heading and the details panel is
    // narrow, so cards slide a little and fade instead of sweeping across the screen.
    return { x: 0, y: 0.55, width, height: width * 0.66, spacing: 2.1 };
  }
  const width = Math.min(viewport.width * 0.4, 6.4);
  return { x: viewport.width * 0.23, y: -0.1, width, height: width * 0.64, spacing: viewport.height * 0.8 };
}

function FloatingProjectCard({
  project,
  index,
  layout,
  trackRef,
  active,
  isMobile,
  onOpen,
}: {
  project: typeof PROJECTS[number];
  index: number;
  layout: TrackLayout;
  trackRef: { current: number };
  active: boolean;
  isMobile: boolean;
  onOpen: () => void;
}) {
  const anchorRef = useRef<THREE.Group>(null);
  const interactionRef = useRef<THREE.Group>(null);
  const imageRef = useRef<THREE.Mesh>(null);
  const backingMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const worldPosition = useRef(new THREE.Vector3());
  const projectedPosition = useRef(new THREE.Vector3());
  const { width, height } = layout;

  useFrame((state, delta) => {
    const anchor = anchorRef.current;
    const interaction = interactionRef.current;
    if (!anchor || !interaction) return;

    // Distance (in cards) from the centre of the track. Cards far off-stage are culled.
    const offset = index - trackRef.current;
    anchor.visible = Math.abs(offset) < 1.25;
    if (!anchor.visible) return;

    // Mobile crossfade: fully opaque when centred, gone before the neighbouring slot.
    const fade = isMobile ? 1 - THREE.MathUtils.smoothstep(Math.abs(offset), 0.25, 0.85) : 1;
    if (backingMaterialRef.current) backingMaterialRef.current.opacity = fade;
    if (imageRef.current) (imageRef.current.material as THREE.Material).opacity = fade;

    const floatY = Math.sin(state.clock.elapsedTime * 0.72 + index * 1.37) * (isMobile ? 0.04 : 0.07);
    // Next project sits below and slides up as scroll progresses.
    anchor.position.set(layout.x, layout.y - offset * layout.spacing + floatY, 0);

    // Pointer tilt: desktop, focused card only.
    let proximity = 0;
    let dx = 0;
    let dy = 0;
    if (!isMobile && active) {
      interaction.getWorldPosition(worldPosition.current);
      projectedPosition.current.copy(worldPosition.current).project(state.camera);
      dx = state.pointer.x - projectedPosition.current.x;
      dy = state.pointer.y - projectedPosition.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      proximity = clamp01(1 - (distance - 0.06) / 0.5);
    }

    easing.dampE(
      interaction.rotation,
      [-dy * 0.16 * proximity, dx * 0.23 * proximity, -dx * 0.025 * proximity],
      0.16,
      delta,
    );
    easing.damp3(interaction.position, [0, 0, proximity * 0.4], 0.2, delta);
    easing.damp3(interaction.scale, active ? 1 : 0.94, 0.18, delta);
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    const target = event.nativeEvent.target;
    if (target instanceof HTMLElement && target.closest('a, button')) return;
    event.stopPropagation();
    onOpen();
  };

  return (
    <group ref={anchorRef} visible={false}>
      <group ref={interactionRef} scale={0.94}>
        <RoundedBox args={[width + 0.2, height + 0.34, 0.12]} radius={0.14} position={[0, -0.08, 0]}>
          <meshStandardMaterial ref={backingMaterialRef} color={active ? '#f3f1dd' : '#e8e9d1'} roughness={0.9} transparent />
        </RoundedBox>
        <DreiImage
          ref={imageRef}
          url={project.image}
          transparent
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

function FloatingProjectGallery({ activeProjectId, onProjectOpen }: SceneProps) {
  const scroll = useScroll();
  const viewport = useThree((state) => state.viewport);
  const isMobile = useIsMobile();
  const rootRef = useRef<THREE.Group>(null);
  // Eased card position along the track, shared with every card (updated once per frame).
  const trackRef = useRef(0);
  const layout = useMemo(
    () => getTrackLayout(viewport, isMobile),
    [viewport.width, viewport.height, isMobile],
  );

  useFrame((state) => {
    const root = rootRef.current;
    if (!root) return;

    const scrollPages = scroll.offset * (scroll.pages - 1);
    const gallery = getGalleryState(scrollPages);
    trackRef.current = gallery.eased;

    // The track travels with the page: it rises into view with the pinned DOM stage,
    // holds while pinned, then scrolls away upward when the stage is released.
    root.position.y = (gallery.release - gallery.leadIn) * viewport.height;
    root.visible = gallery.leadIn < 0.999 && gallery.release < 0.999;
    if (root.visible) state.invalidate();
  });

  return (
    <group ref={rootRef} visible={false}>
      {PROJECTS.map((project, index) => (
        <FloatingProjectCard
          key={project.id}
          project={project}
          index={index}
          layout={layout}
          trackRef={trackRef}
          active={project.id === activeProjectId}
          isMobile={isMobile}
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
