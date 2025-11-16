"use client";

import { X, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useMiniPlayer } from "@/stores/useMiniPlayer";
import Link from "next/link";
import { usePlayerQueue } from "@/stores/usePlayerQueue";
import Image from "next/image";
import { motion } from "framer-motion";

export default function MiniPlayer() {
  const { active, close, videoId } = useMiniPlayer();
  const { current, next, prev, hasNext, hasPrev } = usePlayerQueue();
  const { playing, togglePlay } = useMiniPlayer();

  if (!active || !current) return null;

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    close();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.2 }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      className="fixed bottom-4 right-4 w-80 bg-background/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden z-[999] border dark:border-white/10"
      style={{ touchAction: "none" }}
      role="dialog"
    >
      <div className="flex items-center p-2 gap-3">
        <Link href={`/watch/${current.id}`} className="block flex-shrink-0">
          <Image
            src={current.thumbnail}
            alt={current.title}
            width={100}
            height={56}
            className="w-24 h-14 rounded-md object-cover active:scale-95 transition-transform"
          />
        </Link>

        <div className="flex-1 min-w-0">
            <Link href={`/watch/${current.id}`} className="block">
                <p className="text-sm font-semibold truncate text-foreground">{current.title}</p>
                <p className="text-xs text-muted-foreground truncate">{current.channelName}</p>
            </Link>
        </div>

        <div className="flex items-center text-foreground pl-1">
          <button onClick={togglePlay} className="p-2" aria-label={playing ? "Pause" : "Play"}>
            {playing ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button onClick={handleClose} className="p-2" aria-label="Close Mini Player">
            <X size={20} />
          </button>
        </div>
      </div>
      <motion.div 
        className="h-1 bg-primary"
        initial={{width: "0%"}}
        animate={{width: "100%"}}
        transition={{duration: current.duration ? parseInt(current.duration) * 60 : 300, ease: "linear"}}
      />
    </motion.div>
  );
}
