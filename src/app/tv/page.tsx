
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Player from "@/components/video/Player";
import { getVideoById, getRecommendedVideos, type Video } from "@/lib/youtube";
import { usePlayerQueue } from "@/stores/usePlayerQueue";
import { useTVNavigation } from "@/hooks/useTVNavigation";
import { Skeleton } from "@/components/ui/skeleton";

function TVPageContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("v");
  const router = useRouter();

  const [video, setVideo] = useState<Video | null>(null);
  const [recs, setRecs] = useState<Video[]>([]);
  const { setQueue, next } = usePlayerQueue();

  const upNextRef = useRef<HTMLDivElement>(null);
  useTVNavigation(upNextRef);

  useEffect(() => {
    if (!videoId) {
      // Redirect to a default video or home if no ID is provided
      router.replace("/");
      return;
    }

    setVideo(null);
    setRecs([]);

    getVideoById(videoId).then((v) => {
      if (!v) return;
      setVideo(v);
      getRecommendedVideos(v.id).then((related) => {
        if (related) {
          const videoQueue = [v, ...related];
          setRecs(related);
          setQueue(videoQueue);
        }
      });
    });
  }, [videoId, router, setQueue]);

  if (!videoId) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
        <p>No video specified. Use ?v=[video_id] to watch.</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black">
        <Skeleton className="w-full max-w-7xl aspect-video" />
      </div>
    );
  }

  const handleVideoEnd = () => {
    next(); // This will update the 'current' video in the queue
  };
  
  const handleItemActivate = (vidId: string) => {
      router.push(`/tv?v=${vidId}`);
  }

  return (
    <div className="w-screen h-screen flex flex-col lg:flex-row bg-black text-white overflow-hidden text-lg">
      <div className="flex-1 flex flex-col">
        <div className="w-full aspect-video">
          <Player id={video.id} onEnded={handleVideoEnd} />
        </div>
        <div className="p-6">
          <h1 className="text-4xl font-bold">{video.title}</h1>
          <p className="text-xl text-neutral-400 mt-2">{video.channelName}</p>
        </div>
      </div>

      <div ref={upNextRef} role="list" className="w-full lg:w-[450px] bg-neutral-900/50 p-4 flex flex-col">
        <h2 className="text-3xl font-semibold mb-4 px-4">Up Next</h2>
        <div className="space-y-4 overflow-y-auto">
          {recs.map((vid) => (
            <div
              key={vid.id}
              role="listitem"
              tabIndex={0}
              data-tv-item
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleItemActivate(vid.id);
              }}
              onClick={() => handleItemActivate(vid.id)}
              className="flex gap-4 p-4 rounded-xl cursor-pointer outline-none focus:ring-4 focus:ring-accent bg-neutral-900 focus:bg-neutral-800"
            >
              <img
                src={vid.thumbnail}
                alt={vid.title}
                className="w-48 h-28 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-xl line-clamp-2">{vid.title}</p>
                <p className="text-lg text-neutral-400 mt-1">{vid.channelName}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export default function TVPage() {
    return (
        <React.Suspense fallback={
            <div className="w-screen h-screen flex items-center justify-center bg-black">
                <p className="text-white text-2xl">Loading...</p>
            </div>
        }>
            <TVPageContent />
        </React.Suspense>
    )
}
