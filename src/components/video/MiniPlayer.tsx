"use client";

import { X, Pause, Play } from "lucide-react";
import { useMiniPlayer } from "@/stores/useMiniPlayer";
import Link from "next/link";
import { usePlayerQueue } from "@/stores/usePlayerQueue";
import Image from "next/image";
import { motion } from "framer-motion";

export default function MiniPlayer() {
  const { active, close, playing, togglePlay } = useMiniPlayer();
  const { current, next, prev } = usePlayerQueue();

  if (!active || !current) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.26 }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      className="fixed z-50 right-4 bottom-4 w-72 bg-neutral-900 text-white rounded-xl shadow-lg overflow-hidden"
      style={{ touchAction: "none" }}
    >
      <div className="flex items-center gap-3 p-2">
        <Link href={`/watch/${current.id}`}>
          <Image
            src={current.thumbnail}
            width={112}
            height={63}
            className="w-28 h-16 object-cover rounded"
            alt={current.title}
          />
        </Link>
        <div className="flex-1">
          <Link href={`/watch/${current.id}`}>
            <div className="font-semibold line-clamp-2 text-sm">{current.title}</div>
          </Link>
          <div className="text-xs text-neutral-400">Now playing</div>
        </div>
        <div className="flex flex-col gap-2 items-center">
            <button onClick={togglePlay} className="p-2 rounded bg-white/10">
                {playing ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button onClick={close} className="p-1 rounded bg-white/10">
                <X size={14} />
            </button>
        </div>
      </div>
    </motion.div>
  );
}
