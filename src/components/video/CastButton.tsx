"use client";

import React from "react";
import { Cast } from "lucide-react";

export default function CastButton() {
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
        "Untuk melakukan cast di Android, silakan gunakan opsi 'Cast' atau 'Transmisikan' dari panel notifikasi atau pengaturan cepat sistem Anda."
      );
      return;
    }

    // Fallback for other devices/browsers
    alert(
      "Fitur Cast tidak didukung di browser atau perangkat ini. Coba gunakan Google Chrome untuk fungsionalitas Chromecast."
    );
  };

  return (
    <button
      onClick={handleCast}
      className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors backdrop-blur-sm"
      aria-label="Cast to TV"
    >
      <Cast size={20} />
    </button>
  );
}
