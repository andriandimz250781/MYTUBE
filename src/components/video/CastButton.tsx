"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function CastButton() {
  const [isCastAvailable, setIsCastAvailable] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    // Heuristic detection for cast capability.
    // We can't *scan* the network, but we can make an educated guess.
    const hasChromeCastAPI = typeof window !== 'undefined' && ((window as any).chrome?.cast || (navigator as any).cast);
    const isAndroid = typeof window !== 'undefined' && /android/i.test(navigator.userAgent);

    // If on Chrome with the API or on Android, we assume casting is possible.
    if (hasChromeCastAPI || isAndroid) {
      setIsCastAvailable(true);
    }
  }, []);

  const handleCast = () => {
    // Case 1: Chrome with Chromecast capability (desktop)
    if ((window as any).chrome?.cast?.requestSession) {
      (window as any).chrome.cast.requestSession(
        (session: any) => console.log("Cast session started", session),
        (error: any) => {
            console.error("Cast error:", error);
            toast({
                title: "Cast Error",
                description: "Could not connect to the cast device. Please try again.",
                variant: "destructive"
            });
        }
      );
      return;
    }

    // Case 2: Android device (suggest using system UI)
    if (/android/i.test(navigator.userAgent)) {
      toast({
          title: "Cast from Android",
          description: "To cast, open your phone's Quick Settings panel and tap 'Smart View', 'Screencast', or 'Cast'.",
      });
      return;
    }

    // Fallback for other devices/browsers (e.g., iPhone, Firefox)
    toast({
        title: "Cast Not Available",
        description: "No cast-compatible device detected. For the best experience, please use Google Chrome on a desktop or an Android device.",
        variant: "destructive"
    });
  };

  if (!isMounted) {
      return null;
  }

  return (
    <button
      onClick={handleCast}
      className={cn(
        "p-2 rounded-md transition-opacity flex items-center gap-1.5",
        "bg-black/50 text-white opacity-80 hover:opacity-100",
        !isCastAvailable && "cursor-not-allowed opacity-50"
      )}
      aria-label="Cast to TV"
      title="Cast to TV"
      disabled={!isCastAvailable}
      style={{ backdropFilter: "blur(6px)" }}
    >
       <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 3H3v4h2V7h14v10h-6v2h6a2 2 0 002-2V3z" fill="currentColor"/><path d="M3 19h2a3 3 0 013 3H3v-3z" fill="currentColor" opacity="0.6"/></svg>
       <span className="hidden sm:inline">Cast</span>
    </button>
  );
}