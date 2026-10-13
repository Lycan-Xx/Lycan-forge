import { SCROLL_LAYOUT } from '../config/animationConfig';

/**
 * Pure scroll -> project-sequence math shared by the 3D scene and the HTML overlay.
 * Both layers feed in the same damped ScrollControls offset, so they always agree.
 */

type ScrollLayout = typeof SCROLL_LAYOUT;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const clamp01 = (value: number) => clamp(value, 0, 1);

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Fraction of each project step spent holding still at either end ("settle"). */
const DWELL = 0.16;

/** Card position within one step: holds, glides, holds. 0..1 -> 0..1 */
export function dwellEase(t: number): number {
  return easeInOutCubic(clamp01((t - DWELL) / (1 - 2 * DWELL)));
}

export interface GalleryState {
  /** 1 while the stage is a full page below the viewport, 0 once it has arrived. */
  leadIn: number;
  /** 0 while pinned, rising to 1 as the released stage scrolls off the top. */
  release: number;
  /** Pages the stage has been pinned for (counter-translate amount, in pages). */
  pinned: number;
  /** Raw project progress, 0..count-1 (linear in scroll). */
  progress: number;
  /** Eased project progress: cards hold at integers and glide in between. */
  eased: number;
  /** Project closest to the centre of the stage. */
  index: number;
}

export function getGalleryState(scrollPages: number, layout: ScrollLayout = SCROLL_LAYOUT): GalleryState {
  const last = layout.count - 1;
  const pinned = clamp(scrollPages - layout.galleryStart, 0, layout.pin);
  const progress = Math.min(pinned, layout.travel);
  const base = Math.min(Math.floor(progress + 1e-6), last);
  const eased = last === 0 ? 0 : Math.min(base + (base >= last ? 0 : dwellEase(progress - base)), last);

  return {
    leadIn: clamp01(layout.galleryStart - scrollPages),
    release: clamp01(scrollPages - layout.pinEnd),
    pinned,
    progress,
    eased,
    index: clamp(Math.round(eased), 0, last),
  };
}
