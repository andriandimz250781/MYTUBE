"use client";
import React, { useRef } from "react";

export default function SwipeWrapper({
  children,
  onSwipeUp,
  onSwipeDown,
}: {
  children: React.ReactNode;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}) {
  const startY = useRef<number | null>(null);

  return (
    <div
      onTouchStart={(e) => {
        startY.current = e.touches?.[0]?.clientY ?? null;
      }}
      onTouchEnd={(e) => {
        const endY = e.changedTouches?.[0]?.clientY ?? null;
        if (startY.current == null || endY == null) return;
        const diff = startY.current - endY;
        if (diff > 60) onSwipeUp?.();
        else if (diff < -60) onSwipeDown?.();
        startY.current = null;
      }}
      style={{ touchAction: "pan-y" }}
      className="w-full h-full"
    >
      {children}
    </div>
  );
}
