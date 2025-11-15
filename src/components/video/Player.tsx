"use client";
import { useEffect, useRef } from "react";

export default function Player({
  src,
  videoRef,
}: {
  src: string;
  videoRef: React.RefObject<HTMLVideoElement>;
}) {
  // Auto play even when tab goes background
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        vid.play().catch(() => {});
      } else {
        vid.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [videoRef]);

  // Prevent video from pausing automatically (Chrome/Android background safety)
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const keepPlaying = () => {
      if (vid.paused) vid.play().catch(() => {});
    };

    vid.addEventListener("pause", keepPlaying);
    return () => vid.removeEventListener("pause", keepPlaying);
  }, [videoRef]);

  // Picture In Picture mode
  const enablePiP = async () => {
    const vid = videoRef.current;
    if (!vid) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await vid.requestPictureInPicture();
      }
    } catch {}
  };

  return (
    <div className="relative w-full">
      <video
        ref={videoRef}
        src={src}
        controls
        autoPlay
        playsInline
        preload="auto"
        className="w-full rounded-lg bg-black"
      />

      {/* PiP button */}
      <button
        onClick={enablePiP}
        className="absolute bottom-4 right-4 bg-black/40 text-white px-3 py-1 rounded"
      >
        PiP
      </button>
    </div>
  );
}
