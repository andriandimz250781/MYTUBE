"use client";

import { useRef, useState } from "react";

export default function PullToRefresh({
  children,
  onRefresh,
}: {
  children: React.ReactNode;
  onRefresh: () => Promise<void> | void;
}) {
  const startY = useRef(0);
  const [pulling, setPulling] = useState(false);
  const [offset, setOffset] = useState(0);

  const THRESHOLD = 80; // px to trigger refresh
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY > 0) return;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const current = e.touches[0].clientY;
    const diff = current - startY.current;
    if (diff > 0 && window.scrollY <= 0) {
      setPulling(true);
      setOffset(Math.min(diff / 2, 120));
    }
  };

  const handleTouchEnd = async () => {
    if (!pulling) return;
    setPulling(false);
    if (offset > THRESHOLD) {
      try {
        await onRefresh();
      } catch (e) {
        // ignore
      }
    }
    setOffset(0);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: "pan-y" }}
    >
      <div
        style={{
          transform: `translateY(${offset}px)`,
          transition: pulling ? "none" : "transform 300ms ease",
        }}
      >
        {/* Pull indicator */}
        <div
          style={{ height: offset }}
          className="flex items-end justify-center"
          aria-hidden
        >
          {offset > 20 && (
            <div className="mb-1 text-xs text-muted-foreground">
              {offset > THRESHOLD ? "Release to refresh" : "Pull to refresh"}
            </div>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
