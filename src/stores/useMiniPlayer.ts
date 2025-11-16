import { create } from "zustand";

interface MiniPlayerState {
  active: boolean;
  videoId: string | null;
  playing: boolean;
  open: (videoId: string) => void;
  close: () => void;
  togglePlay: () => void;
  setPlaying: (playing: boolean) => void;
}

export const useMiniPlayer = create<MiniPlayerState>((set, get) => ({
  active: false,
  videoId: null,
  playing: true,

  open: (videoId) => set({ active: true, videoId, playing: true }),
  close: () => set({ active: false, videoId: null, playing: false }),
  togglePlay: () => set((state) => ({ playing: !state.playing })),
  setPlaying: (playing) => set({ playing }),
}));
