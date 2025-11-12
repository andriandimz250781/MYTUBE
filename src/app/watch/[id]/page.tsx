'use client';

import { notFound, useParams } from 'next/navigation';
import { getTrendingVideos, getVideo, getChannel, getImage } from '@/app/lib/data';
import type { Video } from '@/app/lib/data';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CompactVideoCard } from '@/components/video/compact-video-card';
import ReactPlayer from 'react-player/youtube';
import { useEffect, useState, useRef } from 'react';

export default function WatchPage() {
  const params = useParams();
  const [hasWindow, setHasWindow] = useState(false);
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerWrapperRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasWindow(true);
    }

    async function fetchData(videoId: string) {
      if (!videoId) return;

      setLoading(true);
      const videoData = await getVideo(videoId);
      if (!videoData) {
        notFound();
        return;
      }
      setVideo(videoData);

      const { videos: trending } = await getTrendingVideos();
      setRelatedVideos(trending.filter(v => v.id !== videoId));

      setLoading(false);
    }

    const videoId = params.id as string;
    if (videoId) {
      fetchData(videoId);
    }
  }, [params.id]);

  const handlePlayFullscreen = async () => {
    setIsPlaying(true);
    const wrapper = playerWrapperRef.current;
    if (wrapper) {
      try {
        await wrapper.requestFullscreen();
        if (screen.orientation && typeof screen.orientation.lock === 'function') {
          await screen.orientation.lock('landscape');
        }
      } catch (err) {
        console.error("Gagal masuk mode fullscreen:", err);
      }
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsPlaying(false);
        if (screen.orientation && typeof screen.orientation.unlock === 'function') {
            screen.orientation.unlock();
        }
      }
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  if (loading || !video) {
    return <div>Memuat video...</div>;
  }

  const channel = getChannel(video.channelId);
  const channelAvatar = getImage(video.channelAvatarId);

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="flex-grow lg:w-2/3">
        <div ref={playerWrapperRef} className="aspect-video w-full overflow-hidden rounded-xl bg-muted shadow-lg relative">
          {hasWindow && (
            <ReactPlayer
              ref={playerRef}
              url={video.videoUrl}
              width="100%"
              height="100%"
              controls
              playing={isPlaying}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              className="bg-black"
              light={!isPlaying ? video.thumbnailUrl : false}
              playIcon={<button className="absolute inset-0 flex items-center justify-center w-full h-full bg-black/30"><svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%" className="w-16 h-16"><path className="fill-black/80" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"></path><path className="fill-white" d="M 45,24 27,14 27,34"></path></svg></button>}
              onClickPreview={(e) => {
                e.preventDefault();
                handlePlayFullscreen();
              }}
            />
          )}
        </div>
        <div className="py-4">
          <h1 className="font-headline text-2xl font-bold mb-2">
            {video.title}
          </h1>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <Link href={`/channel/${video.channelId}`}>
                <Avatar>
                  {channelAvatar && (
                    <AvatarImage
                      src={channelAvatar.imageUrl}
                      alt={video.channelName}
                    />
                  )}
                  <AvatarFallback>{video.channelName.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link
                  href={`/channel/${video.channelId}`}
                  className="font-semibold hover:text-primary"
                >
                  {video.channelName}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {channel?.subscribers} pelanggan
                </p>
              </div>
            </div>
            <Button
              variant="default"
              className="rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90"
            >
              Berlangganan
            </Button>
          </div>
          <div className="mt-4 rounded-lg bg-secondary/50 p-4 text-sm transition-colors hover:bg-secondary/70">
            <p className="font-semibold">
              {video.views} kali ditonton &bull; {video.uploadedAt}
            </p>
            <p className="mt-2 whitespace-pre-wrap">{video.description}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {video.tags.map(tag => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="lg:w-1/3 lg:max-w-md">
        <h2 className="font-headline text-xl font-bold mb-4">Berikutnya</h2>
        <div className="flex flex-col gap-4">
          {relatedVideos
            .map(relatedVideo => (
              <CompactVideoCard key={relatedVideo.id} video={relatedVideo} />
            ))}
        </div>
      </div>
    </div>
  );
}
