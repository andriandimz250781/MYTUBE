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

  useSwipe(swipeRef, {
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
  });

  return <div ref={swipeRef}>{children}</div>;
}
