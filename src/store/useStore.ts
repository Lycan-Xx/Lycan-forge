import { create } from 'zustand';

interface State {
  isHome: boolean;
  setIsHome: (isHome: boolean) => void;
  selectedProjectId: string | null;
  setSelectedProject: (id: string | null) => void;
}

export const useStore = create<State>((set) => ({
  isHome: false,
  setIsHome: (isHome) => set({ isHome }),
  selectedProjectId: null,
  setSelectedProject: (id) => set({ selectedProjectId: id }),
}));
