"use client";
import React, { useEffect, useState, Suspense } from "react";
import Player from "./Player";
import AutoNext from "./AutoNext";
import SwipeWrapper from "./SwipeWrapper";
import VideoCard from "./VideoCard";
import { getVideoById, getRecommendations, markPlayed, type Video } from "../../lib/videos";
import { useVideo } from "./VideoProvider";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

function VideoPlayerSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      <Skeleton className="w-full aspect-video rounded-lg" />
      <div className="mt-4">
        <Skeleton className="h-7 w-3/4 rounded" />
        <Skeleton className="h-5 w-1/2 mt-2 rounded" />
      </div>
       <div className="mt-6">
        <Skeleton className="h-6 w-1/3 mb-3 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="w-full aspect-video rounded-lg" />
            <Skeleton className="h-5 w-5/6 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
           <div className="flex flex-col gap-2">
            <Skeleton className="w-full aspect-video rounded-lg" />
            <Skeleton className="h-5 w-5/6 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}


export default function VideoPage({ videoId }: { videoId: string }) {
  const [video, setVideo] = useState<Video | null>(null);
  const [recs, setRecs] = useState<Video[]>([]);
  const { videoEl, setFloating } = useVideo();
  const router = useRouter();
  const localVideoRef = videoEl; // This ref is for the <video> element which we are not using with iframe.

  useEffect(() => {
    let mounted = true;
    setVideo(null); // Clear previous video
    setRecs([]); // Clear previous recommendations
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

  if (!video) {
    return <VideoPlayerSkeleton />;
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      <SwipeWrapper
        onSwipeUp={() => {
          // In a real app, this could reveal comments or description
          console.log("open details");
        }}
        onSwipeDown={() => {
          // Minimize to mini player
          setFloating(true);
        }}
      >
        <>
          <Player src={video.src} id={video.id} />
          {/* AutoNext relies on <video> events, which we don't have with iframe. 
              The auto-play feature of the YouTube embed will handle playing the next related video.
              We can remove AutoNext component or adapt it later.
          <AutoNext videoRef={localVideoRef} onNext={onNext} /> 
          */}
          <div className="mt-4">
            <h1 className="text-xl font-bold">{video.title}</h1>
            <p className="text-sm text-muted-foreground">{video.channelName}</p>
            <p className="text-xs text-muted-foreground mt-1">{video.views} views &bull; {video.uploadedAt}</p>
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
              {recs.length === 0 && Array.from({length: 4}).map((_, i) => (
                 <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="w-full aspect-video rounded-lg" />
                  <Skeleton className="h-5 w-5/6 rounded" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                </div>
              ))}
            </div>
          </div>
        </>
      </SwipeWrapper>
    </div>
  );
}
