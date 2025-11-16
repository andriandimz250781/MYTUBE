import { create } from 'zustand';

interface MiniPlayerState {
  playing: boolean;
  setPlaying: (playing: boolean) => void;
  togglePlay: () => void;
}

export const useMiniPlayer = create<MiniPlayerState>((set) => ({
  playing: false,
  setPlaying: (playing) => set({ playing }),
  togglePlay: () => set((state) => ({ playing: !state.playing })),
}));
