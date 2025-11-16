import { create } from "zustand";

interface MiniPlayerState {
  active: boolean;
  videoId: string | null;
  playing: boolean;
  open: (videoId: string) => void;
  close: () => void;
  togglePlay: () => void;
}

export const useMiniPlayer = create<MiniPlayerState>((set) => ({
  active: false,
  videoId: null,
  playing: true,

  open: (videoId) => set({ active: true, videoId, playing: true }),
  close: () => set({ active: false, videoId: null, playing: false }),
  togglePlay: () =>
    set((state) => ({ playing: !state.playing })),
}));
