"use client";

import React, { useEffect, useState } from "react";
import { Cast } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CastButton() {
  const [isCastAvailable, setIsCastAvailable] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Heuristic detection for cast capability
    const hasChromeCastAPI = typeof window !== 'undefined' && (window as any).chrome?.cast;
    const isAndroid = typeof window !== 'undefined' && /android/i.test(navigator.userAgent);

    if (hasChromeCastAPI || isAndroid) {
      setIsCastAvailable(true);
    }
    // Trigger animation after mount
    setIsMounted(true);
  }, []);

  const handleCast = () => {
    // Case 1: Chrome with Chromecast capability (desktop)
    if ((window as any).chrome?.cast?.requestSession) {
      (window as any).chrome.cast.requestSession(
        (session: any) => console.log("Cast session started", session),
        (error: any) => console.error("Cast error:", error)
      );
      return;
    }

    // Case 2: Android device (suggest using system UI)
    if (/android/i.test(navigator.userAgent)) {
      alert(
        "To cast on Android, please use the 'Cast' or 'Smart View' option from your phone's quick settings or notification panel."
      );
      return;
    }

    // Fallback for other devices/browsers (e.g., iPhone)
    alert(
      "Cast feature is not available on this device. For the best experience, use Google Chrome on a desktop or an Android device."
    );
  };

  if (!isCastAvailable) {
    return null; // Don't render the button if no cast capability is detected
  }

  return (
    <button
      onClick={handleCast}
      className={cn(
        "absolute top-2 right-2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-all duration-300 ease-out backdrop-blur-sm",
        // Animation classes
        isMounted ? "scale-100 opacity-100" : "scale-75 opacity-0"
      )}
      aria-label="Cast to TV"
    >
      <Cast size={20} className={cn(isCastAvailable && "animate-pulse")} />
    </button>
  );
}
