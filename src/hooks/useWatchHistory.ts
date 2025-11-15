"use client";

import { useEffect, useState } from "react";
import type { Video } from "@/lib/youtube";

const HISTORY_KEY = "watch_history";

// Custom hook to manage watch history in localStorage
export function useWatchHistory() {
  const [history, setHistory] = useState<Video[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load history from localStorage on initial client-side render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to parse watch history from localStorage", error);
      // Clear corrupted history
      localStorage.removeItem(HISTORY_KEY);
    }
    setIsLoaded(true);
  }, []);

  // Function to add a video to the history
  const addVideoToHistory = (video: Video) => {
    if (!video || !video.id) return;

    setHistory(currentHistory => {
      // Remove the video if it already exists to move it to the front
      const filteredHistory = currentHistory.filter(v => v.id !== video.id);
      const updatedHistory = [video, ...filteredHistory];
      
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
      } catch (error) {
        console.error("Failed to save watch history to localStorage", error);
      }
      
      return updatedHistory;
    });
  };

  return { history, addVideoToHistory, isLoaded };
}
