"use client";

import { useEffect } from "react";
import type { Video } from "@/lib/youtube";
import { useWatchHistory } from "@/hooks/useWatchHistory";

interface WatchHistoryLoggerProps {
  video: Video;
}

// This is a client component that doesn't render anything.
// Its only job is to call the useWatchHistory hook to save the video.
export default function WatchHistoryLogger({ video }: WatchHistoryLoggerProps) {
  const { addVideoToHistory } = useWatchHistory();

  useEffect(() => {
    if (video) {
      addVideoToHistory(video);
    }
  }, [video, addVideoToHistory]);

  return null; // This component does not render any UI
}
