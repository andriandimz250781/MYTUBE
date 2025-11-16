"use client";

import { motion } from "framer-motion";
import { X, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useMiniPlayer } from "@/stores/useMiniPlayer";
import { useVideo } from "./VideoProvider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePlayerQueue } from "@/stores/usePlayerQueue";

export default function MiniPlayer() {
  const { floating, setFloating, currentId } = useVideo();
  const { playing, togglePlay } = useMiniPlayer();
  const { next, prev, hasNext, hasPrev } = usePlayerQueue();

  if (!floating || !currentId) return null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    next();
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    prev();
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      className="fixed bottom-4 right-4 w-64 bg-background border border-border rounded-xl overflow-hidden shadow-xl z-[9999]"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Link href={`/watch/${currentId}`} className="cursor-pointer">
        <iframe
          width="100%"
          height="120"
          src={`https://www.youtube.com/embed/${currentId}?autoplay=1&controls=0&modestbranding=1&rel=0`}
          className="pointer-events-none"
        />
      </Link>

      <div className="flex items-center justify-between p-2 bg-card">
         <button onClick={handlePrev} disabled={!hasPrev()} className="p-2 text-foreground disabled:opacity-50">
          <SkipBack size={20} />
        </button>
        <button onClick={togglePlay} className="p-2 text-foreground">
          {playing ? <Pause size={20} /> : <Play size={20} />}
        </button>
         <button onClick={handleNext} disabled={!hasNext()} className="p-2 text-foreground disabled:opacity-50">
          <SkipForward size={20} />
        </button>

        <button onClick={() => setFloating(false)} className="p-2 text-foreground">
          <X size={20} />
        </button>
      </div>
    </motion.div>
  );
}
