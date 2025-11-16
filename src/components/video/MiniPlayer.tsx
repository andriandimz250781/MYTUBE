"use client";

import { X, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useMiniPlayer } from "@/stores/useMiniPlayer";
import Link from "next/link";
import { usePlayerQueue } from "@/stores/usePlayerQueue";
import Image from "next/image";

export default function MiniPlayer() {
  const { active, close } = useMiniPlayer();
  const { current, next, prev, hasNext, hasPrev } = usePlayerQueue();
  // For now, play/pause state is not synced with the actual iframe player,
  // this is a placeholder for future deeper integration.
  const { playing, togglePlay } = useMiniPlayer();

  if (!active || !current) return null;

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    close();
  };

  return (
    <div
      className="fixed bottom-3 left-3 right-3 bg-card/80 backdrop-blur-xl
                 rounded-xl shadow-2xl flex items-center p-2 z-[999]
                 border border-white/10"
    >
      {/* Thumbnail as Link */}
      <Link href={`/watch/${current.id}`} className="block">
        <Image
          src={current.thumbnail}
          alt={current.title}
          width={80}
          height={45}
          className="w-20 h-[45px] rounded-md object-cover mr-3 active:scale-95 transition-transform"
        />
      </Link>

      {/* Title */}
      <div className="flex-1 text-foreground text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap">
        {current.title}
      </div>

      {/* Controls */}
      <div className="flex items-center text-foreground px-2">
        <button onClick={prev} disabled={!hasPrev()} className="p-2 disabled:opacity-50" aria-label="Previous Video">
          <SkipBack size={20} />
        </button>
        <button onClick={togglePlay} className="p-2" aria-label={playing ? "Pause" : "Play"}>
          {playing ? <Pause size={22} /> : <Play size={22} />}
        </button>
        <button onClick={next} disabled={!hasNext()} className="p-2 disabled:opacity-50" aria-label="Next Video">
          <SkipForward size={20} />
        </button>
        <button onClick={handleClose} className="p-2 ml-2" aria-label="Close Mini Player">
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
