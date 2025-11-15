"use client";
import React, { createContext, useContext, useRef, useState } from "react";

type VideoContextType = {
  videoEl: React.RefObject<HTMLVideoElement>;
  setFloating: (v: boolean) => void;
  floating: boolean;
  setCurrentId: (id: string) => void;
  currentId?: string;
};

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const videoEl = useRef<HTMLVideoElement>(null);
  const [floating, setFloating] = useState(false);
  const [currentId, setCurrentId] = useState<string | undefined>(undefined);

  return (
    <VideoContext.Provider
      value={{
        videoEl,
        setFloating,
        floating,
        setCurrentId: (id: string) => setCurrentId(id),
        currentId,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}

export function useVideo() {
  const ctx = useContext(VideoContext);
  if (!ctx) throw new Error("useVideo must be used inside VideoProvider");
  return ctx;
}
