"use client";

import { motion } from "framer-motion";
import { X, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useMiniPlayer } from "@/stores/useMiniPlayer";
import { useVideo } from "./VideoProvider";
import Link from "next/link";
import { usePlayerQueue } from "@/stores/usePlayerQueue";

export default function MiniPlayer() {
  const { floating, setFloating, currentId } = useVideo();
  const { playing, togglePlay } = useMiniPlayer();
  const { next, prev, hasNext, hasPrev } = usePlayerQueue();

  if (!floating || !currentId) return null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    next();
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    prev();
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setFloating(false);
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      className="fixed bottom-4 right-4 w-64 bg-background border border-border rounded-xl overflow-hidden shadow-xl z-[9999]"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Link href={`/watch/${currentId}`} className="cursor-pointer block">
        <div className="relative w-full h-[120px]">
           <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${currentId}?autoplay=1&controls=0&modestbranding=1&rel=0`}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />
        </div>
      </Link>

      <div className="flex items-center justify-between p-2 bg-card">
         <button onClick={handlePrev} disabled={!hasPrev()} className="p-2 text-foreground disabled:opacity-50" aria-label="Previous Video">
          <SkipBack size={20} />
        </button>
        <button onClick={togglePlay} className="p-2 text-foreground" aria-label={playing ? "Pause" : "Play"}>
          {playing ? <Pause size={20} /> : <Play size={20} />}
        </button>
         <button onClick={handleNext} disabled={!hasNext()} className="p-2 text-foreground disabled:opacity-50" aria-label="Next Video">
          <SkipForward size={20} />
        </button>

        <button onClick={handleClose} className="p-2 text-foreground" aria-label="Close Mini Player">
          <X size={20} />
        </button>
      </div>
    </motion.div>
  );
}
