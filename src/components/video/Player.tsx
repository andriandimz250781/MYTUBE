"use client";
import React, { useEffect, useRef } from "react";
import { useVideo } from "./VideoProvider";

export default function Player({
  src,
  id,
  onEnded,
}: {
  src: string;
  id: string;
  onEnded?: () => void;
}) {
  const { setCurrentId, setFloating } = useVideo();
  const ref = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<any>(null); // To hold the YouTube player instance

  useEffect(() => {
    setCurrentId(id);

    // Function to load the IFrame Player API code asynchronously.
    const loadYouTubeAPI = () => {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
      } else {
        // If API is already loaded, create the player
        createPlayer();
      }
    };
    
    const createPlayer = () => {
       if (playerRef.current) {
        playerRef.current.destroy();
      }
      playerRef.current = new window.YT.Player(ref.current, {
        events: {
          'onStateChange': onPlayerStateChange
        }
      });
    }

    // This function creates an <iframe> (and YouTube player)
    // after the API code downloads.
    window.onYouTubeIframeAPIReady = createPlayer;

    const onPlayerStateChange = (event: any) => {
      // YT.PlayerState.ENDED is 0
      if (event.data === window.YT.PlayerState.ENDED) {
        onEnded?.();
      }
    }

    loadYouTubeAPI();

    return () => {
      // Cleanup
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    }

  }, [id, setCurrentId, onEnded]);


  // Picture-in-Picture helper for iframe
  const togglePiP = async () => {
    setFloating(true);
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
        id="youtube-player"
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
