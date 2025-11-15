"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useSwipe } from "@/hooks/useSwipe";

export default function SwipeWrapper({
  children,
  nextId,
}: {
  children: React.ReactNode;
  nextId?: string;
}) {
  const router = useRouter();
  const swipeRef = useRef<HTMLDivElement>(null);

  const handleSwipeLeft = () => {
    if (nextId) {
      router.push(`/watch/${nextId}`);
    }
  };

  const handleSwipeRight = () => {
    router.back();
  };
  
  const handleSwipeDown = () => {
    // Scroll down a bit to trigger the mini-player
    window.scrollBy({ top: 200, behavior: 'smooth' });
  };
  
  const handleSwipeUp = () => {
    // Scroll to the top to exit mini-player
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useSwipe(swipeRef, {
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    onSwipeUp: handleSwipeUp,
    onSwipeDown: handleSwipeDown
  });

  return <div ref={swipeRef}>{children}</div>;
}
