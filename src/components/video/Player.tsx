"use client";
import React, { useEffect, useRef } from "react";
import { useVideo } from "./VideoProvider";
import { useMiniPlayer } from "@/stores/useMiniPlayer";
import CastButton from "./CastButton";

export default function Player({
  id,
  onEnded,
}: {
  id: string;
  onEnded?: () => void;
}) {
  const { setCurrentId, setFloating } = useVideo();
  const playerRef = useRef<any>(null);
  const { playing, togglePlay } = useMiniPlayer();

  useEffect(() => {
    setCurrentId(id);

    const loadYouTubeAPI = () => {
      if (!(window as any).YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
      } else {
        createPlayer();
      }
    };

    const createPlayer = () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      playerRef.current = new (window as any).YT.Player(`youtube-player-${id}`, {
        videoId: id,
        playerVars: {
            autoplay: 1,
            controls: 1,
            modestbranding: 1,
            rel: 0,
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    };

    (window as any).onYouTubeIframeAPIReady = createPlayer;

    const onPlayerReady = (event: any) => {
        if (playing) {
          event.target.playVideo();
        }
    }

    const onPlayerStateChange = (event: any) => {
      if (event.data === (window as any).YT.PlayerState.ENDED) {
        onEnded?.();
      }
    };

    loadYouTubeAPI();

    return () => {
      if (playerRef.current) {
        try {
            playerRef.current.destroy();
        } catch (e) {
            console.error("Error destroying player", e);
        }
      }
    };
  }, [id, setCurrentId, onEnded, playing]);

  // Sync player with zustand state
  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.getPlayerState === 'function') {
        if (playing && playerRef.current.getPlayerState() !== 1) {
            playerRef.current.playVideo();
        } else if (!playing && playerRef.current.getPlayerState() === 1) {
            playerRef.current.pauseVideo();
        }
    }
  }, [playing]);


  const togglePiP = async () => {
    setFloating(true);
  };

  return (
    <div className="w-full relative aspect-video bg-black rounded-lg overflow-hidden">
      <div id={`youtube-player-${id}`} className="w-full h-full"></div>
       <CastButton />
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
