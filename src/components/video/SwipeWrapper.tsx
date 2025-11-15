"use client";

import { useEffect, useRef, type RefObject, ReactNode } from "react";

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

const MIN_SWIPE_DISTANCE = 80;

function useSwipe(
  ref: RefObject<HTMLElement>,
  handlers: SwipeHandlers
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;

      const diffX = endX - startX;
      const diffY = endY - startY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX < -MIN_SWIPE_DISTANCE && handlers.onSwipeLeft) {
          handlers.onSwipeLeft();
        } else if (diffX > MIN_SWIPE_DISTANCE && handlers.onSwipeRight) {
          handlers.onSwipeRight();
        }
      } else {
        // Vertical swipe
        if (diffY < -MIN_SWIPE_DISTANCE && handlers.onSwipeUp) {
          handlers.onSwipeUp();
        } else if (diffY > MIN_SWIPE_DISTANCE && handlers.onSwipeDown) {
          handlers.onSwipeDown();
        }
      }
    };

    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [ref, handlers]);
}


export default function SwipeWrapper({
  children,
  onSwipeUp,
  onSwipeDown,
  onSwipeLeft,
  onSwipeRight,
}: {
  children: ReactNode;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}) {
  const swipeRef = useRef<HTMLDivElement>(null);

  useSwipe(swipeRef, {
      onSwipeUp,
      onSwipeDown,
      onSwipeLeft,
      onSwipeRight,
  });

  return (
    <div ref={swipeRef} className="w-full h-full">
      {children}
    </div>
  );
}
