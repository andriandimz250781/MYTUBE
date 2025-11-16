"use client";

import React, { useEffect, useState } from "react";
import { Cast } from "lucide-react";

export default function CastButton() {
  const [isCastAvailable, setIsCastAvailable] = useState(false);

  useEffect(() => {
    // Heuristic detection:
    // 1. Check for ChromeCast API availability on non-Android devices.
    // The actual availability is confirmed by the Google Cast SDK loader, 
    // but the presence of the API object is a good indicator.
    const hasChromeCastAPI = typeof window !== 'undefined' && (window as any).chrome?.cast;

    // 2. Assume Android devices always have a system-level cast option (Miracast/Smart View).
    const isAndroid = typeof window !== 'undefined' && /android/i.test(navigator.userAgent);

    if (hasChromeCastAPI || isAndroid) {
      setIsCastAvailable(true);
    }
  }, []);

  const handleCast = () => {
    // Case 1: Chrome with Chromecast capability
    // The Google Cast SDK needs to be loaded for this to work.
    // This is a simplified check. A full implementation requires the SDK.
    if ((window as any).chrome?.cast?.requestSession) {
      (window as any).chrome.cast.requestSession(
        (session: any) => {
          console.log("Cast session started", session);
        },
        (error: any) => {
          console.error("Cast error:", error);
        }
      );
      return;
    }

    // Case 2: Android device (suggest using system UI)
    if (/android/i.test(navigator.userAgent)) {
      alert(
        "To cast on Android, please use the 'Cast' or 'Smart View' option from your phone's system notification panel or quick settings."
      );
      return;
    }

    // Fallback for other devices/browsers
    alert(
      "Cast feature not supported on this browser or device. Try using Google Chrome for Chromecast functionality."
    );
  };

  if (!isCastAvailable) {
    return null; // Or render a disabled button if you prefer
  }

  return (
    <button
      onClick={handleCast}
      className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors backdrop-blur-sm"
      aria-label="Cast to TV"
    >
      <Cast size={20} className="animate-pulse" />
    </button>
  );
}
