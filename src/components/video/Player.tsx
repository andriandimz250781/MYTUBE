"use client";
import React, { useEffect, useRef } from "react";
import { useVideo } from "./VideoProvider";
import { prefetchNext } from "../../lib/videos";

export default function Player({
  src,
  id,
  onProgress,
}: {
  src: string;
  id: string;
  onProgress?: (percent: number) => void;
}) {
  const { videoEl, setFloating, setCurrentId } = useVideo();
  const localRef = useRef<HTMLVideoElement | null>(null);
  const ref = videoEl; // shared ref

  // ensure shared ref points to element
  useEffect(() => {
    if (localRef.current) {
      ref.current = localRef.current;
    }
    return () => {
      if (ref.current === localRef.current) {
        ref.current = null;
      }
    };
  }, [ref]);

  useEffect(() => {
    setCurrentId(id);
  }, [id, setCurrentId]);

  // visibility & keepalive
  useEffect(() => {
    const vid = localRef.current;
    if (!vid) return;

    const handleVisibility = () => {
      // attempt to keep playing when tab hidden (works only if allowed by browser)
      if (document.visibilityState === "hidden") {
        vid.play().catch(() => {});
      }
    };

    const handlePause = () => {
      // if the user didn't intentionally pause and video is still visible, try resume
      // (be careful: don't fight user explicit pause)
      // we allow resume only if document is hidden (prevent autoplay loops)
      if (document.visibilityState === "hidden") {
        vid.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    vid.addEventListener("pause", handlePause);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      vid.removeEventListener("pause", handlePause);
    };
  }, []);

  // progress handler -> prefetch next when >= 80%
  useEffect(() => {
    const vid = localRef.current;
    if (!vid) return;

    let didPrefetch = false;

    const onTime = () => {
      const percent = vid.duration ? vid.currentTime / vid.duration : 0;
      onProgress?.(percent);
      if (!didPrefetch && percent >= 0.8) {
        didPrefetch = true;
        prefetchNext(id).catch(() => {});
      }
    };

    vid.addEventListener("timeupdate", onTime);
    return () => vid.removeEventListener("timeupdate", onTime);
  }, [id, onProgress]);

  // Picture-in-Picture helper
  const togglePiP = async () => {
    const vid = localRef.current;
    if (!vid) return;
    try {
      if ((document as any).pictureInPictureElement) {
        await (document as any).exitPictureInPicture();
      } else if ((vid as any).requestPictureInPicture) {
        await (vid as any).requestPictureInPicture();
      } else {
        // fallback: use floating mini-player
        setFloating(true);
      }
    } catch {
      setFloating(true);
    }
  };

  return (
    <div className="w-full relative">
      <video
        ref={localRef}
        src={src}
        controls
        autoPlay
        playsInline
        preload="auto"
        className="w-full rounded bg-black"
        controlsList="nodownload noremoteplayback"
      />
      <div className="absolute right-3 bottom-3 flex gap-2">
        <button
          onClick={() => {
            const el = localRef.current;
            if (!el) return;
            if (el.paused) el.play().catch(() => {});
            else el.pause();
          }}
          className="px-3 py-1 rounded bg-black/40 text-white text-sm"
        >
          ▶︎/❚❚
        </button>

        <button
          onClick={togglePiP}
          className="px-3 py-1 rounded bg-black/40 text-white text-sm"
        >
          PiP
        </button>
      </div>
    </div>
  );
}