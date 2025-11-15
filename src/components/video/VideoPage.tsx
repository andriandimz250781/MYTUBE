"use client";
import React, { useEffect, useRef, useState } from "react";
import Player from "./Player";
import AutoNext from "./AutoNext";
import SwipeWrapper from "./SwipeWrapper";
import VideoCard from "./VideoCard";
import { getVideoById, getRecommendations, markPlayed, type Video } from "../../lib/videos";
import { useVideo } from "./VideoProvider";
import { useRouter } from "next/navigation";

export default function VideoPage({ videoId }: { videoId: string }) {
  const [video, setVideo] = useState<Video | null>(null);
  const [recs, setRecs] = useState<Video[]>([]);
  const { videoEl, setFloating } = useVideo();
  const router = useRouter();
  const localVideoRef = videoEl; // shared ref

  useEffect(() => {
    let mounted = true;
    getVideoById(videoId).then((v) => {
      if (!mounted || !v) return;
      setVideo(v);
      getRecommendations(v).then(setRecs);
      markPlayed(videoId).catch(() => {});
    });
    return () => {
      mounted = false;
    };
  }, [videoId]);

  const onNext = () => {
    // pick first recommendation as next
    if (recs?.length) {
      const next = recs[0];
      router.push(`/watch/${next.id}`);
      // keep floating if user minimized
      setFloating(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      <SwipeWrapper
        onSwipeUp={() => {
          // open details (no-op here)
        }}
        onSwipeDown={() => {
          // minimize to mini player
          setFloating(true);
        }}
      >
        {video ? (
          <>
            <Player src={video.src} id={video.id} />
            <AutoNext videoRef={localVideoRef} onNext={onNext} />
            <div className="mt-4">
              <h1 className="text-xl font-bold">{video.title}</h1>
              <p className="text-sm text-neutral-400">{video.channelName}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-3">Recommended</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recs.map((r) => (
                  <VideoCard
                    key={r.id}
                    id={r.id}
                    thumbnail={r.thumbnail}
                    title={r.title}
                    channel={r.channelName}
                    views={r.views}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div>Loading...</div>
        )}
      </SwipeWrapper>
    </div>
  );
}
