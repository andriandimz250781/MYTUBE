"use client";
import React, { useEffect, useRef } from "react";
import { useVideo } from "./VideoProvider";

export default function Player({
  src,
  id,
  onProgress,
}: {
  src: string;
  id: string;
  onProgress?: (percent: number) => void;
}) {
  const { setCurrentId, setFloating } = useVideo();
  const ref = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    setCurrentId(id);
  }, [id, setCurrentId]);

  // Picture-in-Picture helper for iframe
  const togglePiP = async () => {
    const iframe = ref.current;
    if (!iframe) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        // A trick to enable PiP on an iframe: create a dummy video element
        const video = document.createElement('video');
        video.srcObject = new MediaStream(); // empty stream
        video.muted = true;

        video.addEventListener('enterpictureinpicture', () => {
          iframe.classList.add('pip-active'); // you can style the placeholder if needed
        });

        video.addEventListener('leavepictureinpicture', () => {
          iframe.classList.remove('pip-active');
        });

        await video.play();
        await (video as any).requestPictureInPicture();
      } else {
        // fallback: use our custom floating mini-player
        setFloating(true);
      }
    } catch(e) {
      console.error("PiP failed, falling back to mini-player.", e);
      setFloating(true);
    }
  };

  return (
    <div className="w-full relative aspect-video bg-black rounded-lg overflow-hidden">
      <iframe
        ref={ref}
        src={src}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full"
      ></iframe>

       <div className="absolute right-3 bottom-3 flex gap-2">
        <button
          onClick={togglePiP}
          className="px-3 py-1 rounded bg-black/40 text-white text-sm opacity-80 hover:opacity-100 transition-opacity"
        >
          PiP
        </button>
      </div>
    </div>
  );
}
