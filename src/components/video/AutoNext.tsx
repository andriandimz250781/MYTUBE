"use client";

import { useEffect } from "react";

export default function AutoNext({
  videoRef,
  onNext,
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
  onNext: () => void;
}) {
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const handleEnd = () => {
      setTimeout(() => {
        onNext();
      }, 1000); // 1s delay kaya YouTube
    };

    vid.addEventListener("ended", handleEnd);
    return () => vid.removeEventListener("ended", handleEnd);
  }, [videoRef, onNext]);

  return null;
}
