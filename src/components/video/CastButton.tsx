"use client";

import React, { useEffect, useState } from "react";
import { Cast } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CastButton() {
  const [isCastAvailable, setIsCastAvailable] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Heuristic detection for cast capability.
    // We can't *scan* the network, but we can make an educated guess.
    const hasChromeCastAPI = typeof window !== 'undefined' && (window as any).chrome?.cast;
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
            alert("Could not connect to the cast device. Please try again.");
        }
      );
      return;
    }

    // Case 2: Android device (suggest using system UI)
    if (/android/i.test(navigator.userAgent)) {
      alert(
        "To cast, open your phone's Quick Settings panel and tap 'Smart View', 'Screencast', or 'Cast'."
      );
      return;
    }

    // Fallback for other devices/browsers (e.g., iPhone, Firefox)
    alert(
      "No cast-compatible device detected. For the best experience, please use Google Chrome on a desktop or an Android device."
    );
  };

  // Don't render the button at all if no cast capability is detected after mount
  if (!isMounted) {
      return null;
  }

  return (
    <button
      onClick={handleCast}
      className={cn(
        "absolute top-2 right-2 z-10 p-2 rounded-full text-white transition-all duration-300 ease-out backdrop-blur-sm",
        // Animation for fade-in and scale
        isMounted ? "scale-100 opacity-100" : "scale-75 opacity-0",
        // Visual feedback based on availability
        isCastAvailable ? "bg-black/50 hover:bg-black/75" : "bg-black/20 text-white/60 cursor-not-allowed"
      )}
      aria-label="Cast to TV"
      title="Cast to TV"
      disabled={!isCastAvailable}
    >
      <Cast size={20} className={cn(isCastAvailable && "animate-pulse")} />
    </button>
  );
}
