"use client";
import React, { useEffect, useRef, useState } from "react";
import { useVideo } from "./VideoProvider";
import { useMiniPlayer } from "@/stores/useMiniPlayer";
import CastButton from "./CastButton";
import { Expand, PictureInPicture } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Player({
  id,
  onEnded,
}: {
  id: string;
  onEnded?: () => void;
}) {
  const { setCurrentId, setFloating } = useVideo();
  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const { playing, togglePlay } = useMiniPlayer();
  const { toast } = useToast();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
  }, []);

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
      const playerState = event.data;
      if (playerState === (window as any).YT.PlayerState.ENDED) {
        onEnded?.();
      } else if (playerState === (window as any).YT.PlayerState.PLAYING && !playing) {
        togglePlay();
      } else if (playerState === (window as any).YT.PlayerState.PAUSED && playing) {
        togglePlay();
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
  }, [id, setCurrentId, onEnded, playing, togglePlay]);

  // Sync player with zustand state
  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.getPlayerState === 'function') {
        const playerState = playerRef.current.getPlayerState();
        if (playing && playerState !== 1) { // 1 is YT.PlayerState.PLAYING
            playerRef.current.playVideo();
        } else if (!playing && playerState === 1) {
            playerRef.current.pauseVideo();
        }
    }
  }, [playing]);


  const togglePiP = () => {
    setFloating(true);
  };
  
  const enterImmersiveMode = async () => {
    const elem = playerContainerRef.current;
    if (!elem) return;

    try {
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
        if (screen.orientation?.lock) {
          try {
            await screen.orientation.lock("landscape");
          } catch (e) {
            console.warn("Could not lock screen orientation.", e);
          }
        }
      }
    } catch (e) {
      console.error("Fullscreen request failed.", e);
      toast({
        title: "Fullscreen Failed",
        description: "Your browser might have blocked the request.",
        variant: "destructive"
      });
    }
  };

  return (
    <div ref={playerContainerRef} className="w-full relative aspect-video bg-black rounded-lg overflow-hidden">
      <div id={`youtube-player-${id}`} className="w-full h-full"></div>
      <div className="absolute right-3 bottom-3 flex gap-2">
        <CastButton />
         {isMobile && (
          <button
            onClick={enterImmersiveMode}
            className="px-3 py-1 rounded-md bg-black/50 text-white text-sm opacity-80 hover:opacity-100 transition-opacity flex items-center gap-1.5"
          >
            <Expand size={14} />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
        )}
        <button
          onClick={togglePiP}
          className="px-3 py-1 rounded-md bg-black/50 text-white text-sm opacity-80 hover:opacity-100 transition-opacity flex items-center gap-1.5"
        >
          <PictureInPicture size={14}/>
          <span className="hidden sm:inline">PiP</span>
        </button>
      </div>
    </div>
  );
}
