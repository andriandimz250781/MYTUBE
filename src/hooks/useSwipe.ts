"use client";

import { useEffect, type RefObject } from "react";

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

const MIN_SWIPE_DISTANCE = 80;

export function useSwipe(
  ref: RefObject<HTMLElement>,
  handlers: SwipeHandlers
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let startX = 0;
    let startY = 0;
    let isSwiping = false;

    const handleTouchStart = (e: TouchEvent) => {
      if(e.touches.length === 0) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isSwiping = true;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isSwiping || e.changedTouches.length === 0) return;
      isSwiping = false;

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
