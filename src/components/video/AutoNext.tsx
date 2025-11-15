"use client";
import { useEffect } from "react";

export default function AutoNext({
  videoRef,
  onNext,
  delay = 1000,
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
  onNext: () => void;
  delay?: number;
}) {
  const vid = videoRef.current;
  if (!vid) return;

  const handleEnd = () => {
    setTimeout(() => {
      onNext();
    }, delay);
  };

  vid.addEventListener("ended", handleEnd);
  return () => vid.removeEventListener("ended", handleEnd);
}
