"use client";

import { motion } from "framer-motion";
import { X, Pause, Play } from "lucide-react";
import { useMiniPlayer } from "@/hooks/useMiniPlayer";
import { useVideo } from "./VideoProvider";

export default function MiniPlayer() {
  const { floating, setFloating, currentId } = useVideo();
  const { playing, togglePlay } = useMiniPlayer();

  if (!floating || !currentId) return null;

  return (
    <motion.div
      drag
      dragMomentum={false}
      className="fixed bottom-4 right-4 w-64 bg-black rounded-xl overflow-hidden shadow-xl z-[9999]"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div onClick={() => (window.location.href = `/watch/${currentId}`)}>
        <iframe
          width="100%"
          height="120"
          src={`https://www.youtube.com/embed/${currentId}?autoplay=1&controls=0&modestbranding=1&rel=0`}
          className="pointer-events-none"
        />
      </div>

      <div className="flex items-center justify-between p-2 bg-neutral-900">
        <button onClick={togglePlay} className="p-2 text-white">
          {playing ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <button onClick={() => setFloating(false)} className="p-2 text-white">
          <X size={20} />
        </button>
      </div>
    </motion.div>
  );
}
