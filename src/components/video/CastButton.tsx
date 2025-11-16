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
        "p-2 rounded-md bg-black/50 text-white opacity-80 hover:opacity-100 transition-opacity flex items-center gap-1.5",
        !isCastAvailable && "cursor-not-allowed opacity-50"
      )}
      aria-label="Cast to TV"
      title="Cast to TV"
      disabled={!isCastAvailable}
    >
       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12.25c0-4.02.64-7.9 1.83-11.55A1 1 0 0 1 4.74 0h0a1 1 0 0 1 .91.56c1.13 3.56 1.7 7.23 1.7 10.94" opacity="0.4"></path><path d="M16.53 19.38c3.24-2.43 5.47-6.23 5.47-10.63H10.75c0 4.4 2.23 8.2 5.47 10.63a1 1 0 0 0 1.17-.12h0a1 1 0 0 0-.12-1.17Z"></path><path d="M12 20a12 12 0 0 1-12-12h1.5a10.5 10.5 0 0 0 10.5 10.5v1.5Z"></path></svg>
       <span className="hidden sm:inline">Cast</span>
    </button>
  );
}
