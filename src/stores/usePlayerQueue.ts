import { create } from "zustand";
import type { Video } from "@/lib/youtube";

interface PlayerState {
  queue: Video[];
  currentIndex: number;
  current: Video | null;
  setQueue: (list: Video[], startIndex?: number) => void;
  playAt: (index: number) => void;
  next: () => void;
  prev: () => void;
  hasNext: () => boolean;
  hasPrev: () => boolean;
}

export const usePlayerQueue = create<PlayerState>((set, get) => ({
  queue: [],
  currentIndex: -1,
  current: null,

  setQueue: (list, startIndex = 0) => {
    if (list && list.length > 0) {
        set({
            queue: list,
            currentIndex: startIndex,
            current: list[startIndex],
        });
    } else {
        set({ queue: [], currentIndex: -1, current: null });
    }
  },

  playAt: (index) => {
    const q = get().queue;
    if(index >= 0 && index < q.length) {
      set({ currentIndex: index, current: q[index] });
    }
  },

  next: () => {
    const { currentIndex, queue, playAt } = get();
    const nextIndex = currentIndex + 1;
    if (nextIndex < queue.length) {
      playAt(nextIndex);
    }
  },

  prev: () => {
    const { currentIndex, playAt } = get();
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      playAt(prevIndex);
    }
  },
  
  hasNext: () => {
    const { currentIndex, queue } = get();
    return currentIndex < queue.length - 1;
  },
  
  hasPrev: () => {
    const { currentIndex } = get();
    return currentIndex > 0;
  }
}));
