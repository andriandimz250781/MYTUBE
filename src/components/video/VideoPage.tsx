
"use client";
import React, { useEffect, useState, Suspense, useRef } from "react";
import Player from "./Player";
import { getVideoById, getRecommendedVideos, type Video, prefetchNext } from "@/lib/youtube";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import WatchHistoryLogger from "../WatchHistoryLogger";
import DominantColor from "../DominantColor";
import { useMiniPlayer } from "@/stores/useMiniPlayer";
import { usePlayerQueue } from "@/stores/usePlayerQueue";
import { useSwipe } from "@/hooks/useSwipe";
import Image from "next/image";
import { ThumbsDown } from "lucide-react";

function VideoPlayerSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      <div className="w-full">
         <Skeleton className="w-full aspect-video rounded-lg" />
        <div className="mt-4 space-y-2">
            <Skeleton className="h-7 w-3/4 rounded" />
            <Skeleton className="h-5 w-1/2 rounded" />
        </div>
      </div>
       <div className="w-full lg:w-96 flex-shrink-0 space-y-4">
        <Skeleton className="h-6 w-1/3 rounded" />
        {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4">
            <Skeleton className="w-40 aspect-video rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-5/6 rounded" />
                <Skeleton className="h-4 w-1/2 rounded" />
            </div>
            </div>
        ))}
      </div>
    </div>
  );
}


function VideoContent({ videoId }: { videoId: string }) {
  const [video, setVideo] = useState<Video | null>(null);
  const [recs, setRecs] = useState<Video[]>([]);
  const router = useRouter();
  const { open, close, active: miniPlayerActive } = useMiniPlayer();
  const { setQueue, current, next, prev } = usePlayerQueue();
  const playerContainerRef = useRef<HTMLDivElement>(null);

  useSwipe(playerContainerRef, {
    onSwipeLeft: next,
    onSwipeRight: prev,
    onSwipeDown: () => {
      if (!miniPlayerActive) {
        open(videoId);
      }
    }
  });

  useEffect(() => {
    if (current && current.id !== videoId) {
        router.push(`/watch/${current.id}`);
    }
  }, [current, videoId, router]);


  useEffect(() => {
    let mounted = true;
    setVideo(null);
    setRecs([]);

    getVideoById(videoId).then((v) => {
      if (!mounted || !v) {
        return;
      };
      setVideo(v);
      getRecommendedVideos(v.id).then(related => {
        if(mounted && related) {
          const videoQueue = [v, ...related];
          setRecs(related);
          setQueue(videoQueue);
          if (related.length > 0) {
            prefetchNext(related[0].id).catch(console.error);
          }
        }
      });
    });

     const handler = () => {
      if (!playerContainerRef.current) return;
      const { bottom } = playerContainerRef.current.getBoundingClientRect();
      if (bottom < 0) {
        if (!miniPlayerActive) open(videoId);
      } else {
        if (miniPlayerActive) close();
      }
    };

    window.addEventListener("scroll", handler, { passive: true });

    return () => {
      mounted = false;
      window.removeEventListener("scroll", handler);
      close();
    };
  }, [videoId, router, open, close, setQueue, miniPlayerActive]);
  
  if (!video) {
    return <VideoPlayerSkeleton />;
  }

  const handleVideoEnd = () => {
    next();
  }

  return (
    <>
      <DominantColor imageSrc={video.thumbnail} />
      <WatchHistoryLogger video={video} />
     
      <div className="flex flex-col lg:flex-row gap-8 w-full">
         <div className="w-full">
            <div ref={playerContainerRef}>
                <Player 
                    id={video.id} 
                    onEnded={handleVideoEnd} 
                />
            </div>
            <div className="mt-4">
                <h1 className="text-xl md:text-2xl font-bold leading-tight">{video.title}</h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <p>{video.channelName}</p>
                    <p>{video.views} views</p>
                    <p>{video.uploadedAt}</p>
                </div>
            </div>

            {/* PERSONAL RECOMMENDATIONS */}
            <div className="mt-8">
                <h2 className="font-bold text-lg mb-2">Rekomendasi Untuk Kamu</h2>
                 {recs.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {recs.slice(0, 4).map((v) => (
                            <div key={v.id} className="rounded-xl overflow-hidden bg-card border">
                                <Image
                                    src={v.thumbnail}
                                    alt={v.title}
                                    width={200}
                                    height={112}
                                    className="w-full h-auto object-cover aspect-video cursor-pointer"
                                    onClick={() => router.push(`/watch/${v.id}`)}
                                />
                                <div className="p-2">
                                    <p className="text-sm font-semibold line-clamp-2">{v.title}</p>
                                    <button className="text-xs text-muted-foreground hover:text-red-500 mt-1 flex items-center gap-1 transition-colors">
                                    <ThumbsDown className="w-3 h-3" /> Jangan rekomendasikan
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i}>
                                <Skeleton className="w-full aspect-video rounded-xl" />
                                <Skeleton className="h-4 w-5/6 mt-2 rounded" />
                                <Skeleton className="h-3 w-1/2 mt-1 rounded" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        <div className="w-full lg:w-96 flex-shrink-0 space-y-4">
            <h2 className="text-lg font-semibold">Up Next</h2>
            {recs.length > 0 ? (
            recs.map((vid) => (
                <div
                    key={vid.id}
                    className="flex gap-3 cursor-pointer hover:bg-muted rounded-lg p-2 transition"
                    onClick={() => router.push(`/watch/${vid.id}`)}
                >
                    <Image
                        src={vid.thumbnail}
                        alt={vid.title}
                        width={160}
                        height={90}
                        className="w-40 h-auto rounded-md object-cover aspect-video"
                    />

                    <div className="flex-1">
                    <p className="font-semibold line-clamp-2 text-sm">{vid.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{vid.channelName}</p>
                    </div>
                </div>
            ))
            ) : (
                Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <Skeleton className="w-40 aspect-video rounded-lg flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-5/6 rounded" />
                            <Skeleton className="h-4 w-1/2 rounded" />
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </>
  );
}

export default function VideoPage({ videoId }: { videoId: string }) {
  return (
    <Suspense key={videoId} fallback={<VideoPlayerSkeleton />}>
        <VideoContent videoId={videoId} />
    </Suspense>
  );
}

    