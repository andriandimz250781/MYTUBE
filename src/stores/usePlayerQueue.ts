import { create } from "zustand";
import type { Video } from "@/lib/youtube";

interface PlayerState {
  queue: Video[];
  currentIndex: number;
  current: Video | null;
  setQueue: (list: Video[]) => void;
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

  setQueue: (list) => {
    const currentVideoId = get().current?.id;
    // Try to find the current video in the new list to maintain position
    const newCurrentIndex = list.findIndex(v => v.id === currentVideoId);
    
    if (newCurrentIndex !== -1) {
      // If current video is in the new queue, just update the queue
      set({ 
        queue: list,
        currentIndex: newCurrentIndex,
        current: list[newCurrentIndex]
      });
    } else {
      // If not found, start from the beginning of the new queue
      set({
        queue: list,
        currentIndex: 0,
        current: list[0] || null,
      });
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
