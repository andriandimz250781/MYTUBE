"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default function VideoPlayer({ videoId }: { videoId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMini, setIsMini] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Ensure component is mounted before checking scroll
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      // Activate mini-player when the top 60% of the player is off-screen
      setIsMini(top < -(height * 0.6));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isMounted) {
    // Render a skeleton on the server and initial client render
    return <div className="w-full aspect-video bg-muted rounded-xl animate-pulse" />;
  }
  
  return (
    // The placeholder div that keeps the space in the layout
    <div ref={containerRef} className="w-full aspect-video">
      <div
        className={cn(
          "w-full h-full rounded-xl overflow-hidden transition-all duration-300",
          isMini && "fixed z-50 bottom-4 right-4 w-64 h-36 shadow-2xl"
        )}
      >
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
