import { create } from 'zustand';

interface State {
  isHome: boolean;
  setIsHome: (isHome: boolean) => void;
}

export const useStore = create<State>((set) => ({
  isHome: false,
  setIsHome: (isHome) => set({ isHome }),
}));
