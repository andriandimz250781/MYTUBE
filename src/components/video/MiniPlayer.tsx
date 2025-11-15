"use client";
import React, { useEffect, useState } from "react";
import { useVideo } from "./VideoProvider";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getVideoById } from "@/lib/youtube";

export default function MiniPlayer() {
  const { videoEl, floating, setFloating, currentId } = useVideo();
  const [playing, setPlaying] = useState(false);
  const [videoInfo, setVideoInfo] = useState<{title?: string, thumbnail?: string} | null>(null);

  useEffect(() => {
    const v = videoEl.current;
    if (!v) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    
    if(v.played.length > 0 && !v.paused) {
        setPlaying(true);
    }

    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [videoEl, floating]);

  useEffect(() => {
    if (floating && currentId) {
        getVideoById(currentId).then(video => {
            if(video) {
                setVideoInfo({ title: video.title, thumbnail: video.thumbnail });
            }
        });
    }
  }, [floating, currentId]);

  if (!floating || !currentId) return null;

  return (
    <div
      className={cn(
        "fixed z-50 bottom-4 right-4 w-72 max-w-[80vw] rounded-lg overflow-hidden shadow-lg",
        "bg-card text-card-foreground flex items-center gap-2 p-2 border"
      )}
      role="dialog"
    >
      {videoInfo?.thumbnail && 
        <img
            src={videoInfo.thumbnail}
            alt=""
            className="w-28 h-16 object-cover rounded"
            style={{ flexShrink: 0 }}
        />
      }
      <div className="flex-1 overflow-hidden">
        <div className="text-sm font-semibold line-clamp-2">{videoInfo?.title ?? 'Loading...'}</div>
        <div className="text-xs text-muted-foreground">Playing</div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => {
            const v = videoEl.current;
            if (!v) return;
            if (v.paused) v.play().catch(() => {});
            else v.pause();
          }}
          className="px-2 py-1 rounded bg-secondary text-secondary-foreground hover:bg-muted"
        >
          {playing ? "❚❚" : "▶︎"}
        </button>

        <Link href={`/watch/${currentId ?? ""}`} onClick={() => setFloating(false)}>
          <button className="px-2 py-1 rounded bg-secondary text-secondary-foreground hover:bg-muted text-xs">
            Open
          </button>
        </Link>
      </div>
    </div>
  );
}
