'use client';

import { notFound } from 'next/navigation';
import { getTrendingVideos, getVideo, getChannel, getImage, type VideoResponse } from '@/app/lib/data';
import type { Video } from '@/app/lib/data';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CompactVideoCard } from '@/components/video/compact-video-card';
import ReactPlayer from 'react-player/youtube';
import { useEffect, useState } from 'react';

export default function WatchPage({ params }: { params: { id: string } }) {
  const [hasWindow, setHasWindow] = useState(false);
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasWindow(true);
    }
    
    async function fetchData() {
      const videoId = params.id;
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

    fetchData();

  }, [params.id]);
  
  if (loading || !video) {
    return <div>Memuat video...</div>; // Tampilkan loading state
  }

  const channel = getChannel(video.channelId);
  const channelAvatar = getImage(video.channelAvatarId);

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="flex-grow lg:w-2/3">
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted shadow-lg">
          {hasWindow && (
            <ReactPlayer
              url={video.videoUrl}
              width="100%"
              height="100%"
              controls
              playing
              className="bg-black"
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
