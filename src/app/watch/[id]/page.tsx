'use client';

import { useParams } from 'next/navigation';
import { getTrendingVideos, getVideo, getChannel, type Video, type Channel } from '@/app/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CompactVideoCard } from '@/components/video/compact-video-card';
import { useEffect, useState } from 'react';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import ReactPlayer from 'react-player/youtube';
import { Skeleton } from '@/components/ui/skeleton';

function WatchPageLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
      <div className="flex-grow lg:w-2/3">
        <Skeleton className="aspect-video w-full rounded-xl" />
        <div className="py-4">
          <Skeleton className="h-8 w-3/4" />
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-10 w-28 rounded-full" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
      <div className="lg:w-1/3 lg:max-w-md">
        <Skeleton className="mb-4 h-6 w-32" />
        <div className="flex flex-col gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-[90px] w-[160px] shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WatchPage() {
  const params = useParams();
  const videoId = params.id as string;
  
  const [video, setVideo] = useState<Video | null>(null);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoId) return;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const videoData = await getVideo(videoId);
        setVideo(videoData);

        if (videoData) {
          const [channelData, relatedVideosData] = await Promise.all([
            getChannel(videoData.channelId),
            getTrendingVideos() // Simple "up next" for now
          ]);
          setChannel(channelData);
          setRelatedVideos(relatedVideosData.filter(v => v.id !== videoId));
        } else {
          setError('Video not found or could not be loaded.');
        }
      } catch (e) {
        console.error(e);
        setError('An error occurred while fetching video data.');
      }
      setLoading(false);
    }

    fetchData();
  }, [videoId]);

  if (loading) {
    return <WatchPageLoadingSkeleton />;
  }
  
  if (error) {
    return (
        <div className="text-center py-10">
            <p className="text-destructive font-semibold">Error</p>
            <p className="text-muted-foreground">{error}</p>
        </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Video not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
      <div className="flex-grow lg:w-2/3">
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted shadow-lg">
           <ReactPlayer
              url={`https://www.youtube.com/watch?v=${video.id}`}
              width="100%"
              height="100%"
              controls
              playing
              pip
            />
        </div>
        <div className="py-4">
          <div className="mb-2 flex items-center gap-2">
             <Button variant="ghost" size="icon" className="shrink-0 lg:hidden" asChild>
                <Link href="/">
                    <ArrowLeft className="h-5 w-5" />
                    <span className="sr-only">Go back</span>
                </Link>
             </Button>
             <h1 className="font-headline text-xl md:text-2xl font-bold line-clamp-2">
                {video.title}
             </h1>
          </div>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Link href={`/channel/${video.channelId}`}>
                <Avatar>
                  {channel?.avatarUrl && (
                    <AvatarImage
                      src={channel.avatarUrl}
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
                  {channel?.subscribers} subscribers
                </p>
              </div>
            </div>
            <Button
              variant="default"
              className="w-full rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90 sm:w-auto"
            >
              Subscribe
            </Button>
          </div>
          <div className="mt-4 rounded-lg bg-secondary/50 p-4 text-sm transition-colors hover:bg-secondary/70">
            <p className="font-semibold">
              {video.views} views &bull; {video.uploadedAt}
            </p>
            <p className="mt-2 whitespace-pre-wrap">{video.description}</p>
          </div>
        </div>
      </div>
      <div className="lg:w-1/3 lg:max-w-md">
        <h2 className="font-headline text-xl font-bold mb-4">Up Next</h2>
        <div className="flex flex-col gap-4">
          {relatedVideos.map(relatedVideo => (
              <CompactVideoCard key={relatedVideo.id} video={relatedVideo} />
            ))}
        </div>
      </div>
    </div>
  );
}

    