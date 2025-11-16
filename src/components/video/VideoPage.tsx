"use client";
import React, { useEffect, useState, Suspense } from "react";
import Player from "./Player";
import VideoCard from "./VideoCard";
import { getVideoById, getRelatedVideos, type Video } from "@/lib/youtube";
import { useVideo } from "./VideoProvider";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import WatchHistoryLogger from "../WatchHistoryLogger";
import DominantColor from "../DominantColor";

function VideoPlayerSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Skeleton className="w-full aspect-video rounded-lg" />
      <div className="mt-4">
        <Skeleton className="h-7 w-3/4 rounded" />
        <Skeleton className="h-5 w-1/2 mt-2 rounded" />
      </div>
    </div>
  );
}

function RelatedVideosSkeleton() {
  return (
    <div className="space-y-4">
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
  );
}

function VideoContent({ videoId }: { videoId: string }) {
  const [video, setVideo] = useState<Video | null>(null);
  const [recs, setRecs] = useState<Video[]>([]);
  const { setFloating } = useVideo();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    setVideo(null);
    setRecs([]);

    getVideoById(videoId).then((v) => {
      if (!mounted || !v) {
        // Handle video not found, maybe redirect or show an error
        router.push('/');
        return;
      };
      setVideo(v);
      getRelatedVideos(v.id).then(related => {
        if(mounted && related) setRecs(related);
      });
    });

    return () => {
      mounted = false;
    };
  }, [videoId, router]);

  if (!video) {
    return <VideoPlayerSkeleton />;
  }
  
  const videoSrc = `https://www.youtube.com/embed/${video.id}?autoplay=1&modestbranding=1&rel=0`;

  return (
    <>
      <DominantColor imageSrc={video.thumbnail} />
      <WatchHistoryLogger video={video} />
      <div className="w-full">
        <Player src={videoSrc} id={video.id} />
        <div className="mt-4">
          <h1 className="text-xl md:text-2xl font-bold leading-tight">{video.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
             <p>{video.channelName}</p>
             <p>{video.views} views</p>
             <p>{video.uploadedAt}</p>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-96 flex-shrink-0 space-y-4">
        <h2 className="text-lg font-semibold">Up Next</h2>
        {recs.length > 0 ? (
          recs.map((r) => (
            <VideoCard
              key={r.id}
              video={{
                id: r.id,
                title: r.title,
                thumbnail: r.thumbnail,
                channelName: r.channelName,
                uploadedAt: r.uploadedAt,
                duration: r.duration,
                views: r.views,
              }}
            />
          ))
        ) : (
          <RelatedVideosSkeleton />
        )}
      </div>
    </>
  );
}

export default function VideoPage({ videoId }: { videoId: string }) {
  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      <Suspense key={videoId} fallback={<VideoPlayerSkeleton />}>
        <VideoContent videoId={videoId} />
      </Suspense>
    </div>
  );
}
