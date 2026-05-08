import { create } from 'zustand';

interface State {
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
  currentSection: number;
  setCurrentSection: (section: number) => void;
  isHome: boolean;
  setIsHome: (isHome: boolean) => void;
}

export const useStore = create<State>((set) => ({
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  currentSection: 0,
  setCurrentSection: (section) => set({ currentSection: section }),
  isHome: false,
  setIsHome: (isHome) => set({ isHome }),
}));
