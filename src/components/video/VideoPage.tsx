"use client";

import { useRef } from "react";
import Player from "./Player";
import AutoNext from "./AutoNext";
import SwipeWrapper from "./SwipeWrapper";

export default function VideoPage({
  url,
  nextVideo,
}: {
  url: string;
  nextVideo: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <SwipeWrapper
      onSwipeUp={() => console.log("open details")}
      onSwipeDown={() => console.log("minimize player")}
    >
      <div className="flex flex-col gap-4">
        <Player src={url} videoRef={videoRef} />

        <AutoNext videoRef={videoRef} onNext={nextVideo} />

        <div className="px-4 py-2">
          <h2 className="text-lg font-bold">Video Title</h2>
          <p className="text-sm text-neutral-400">Channel Name</p>
        </div>
      </div>
    </SwipeWrapper>
  );
}
