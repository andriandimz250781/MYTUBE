'use client';

import { useParams } from 'next/navigation';
import { getTrendingVideos, getVideo, getChannel, getImage } from '@/app/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CompactVideoCard } from '@/components/video/compact-video-card';
import { useEffect, useState } from 'react';
import { ArrowLeft, PlayCircle } from 'lucide-react';

export default function WatchPage() {
  const params = useParams();
  const videoId = params.id as string;
  const [showPlayer, setShowPlayer] = useState(false);
  const [relatedVideos, setRelatedVideos] = useState<Awaited<ReturnType<typeof getTrendingVideos>>>([]);

  useEffect(() => {
    getTrendingVideos().then(v => setRelatedVideos(v));
  }, []);

  const video = getVideo(videoId);

  if (!video) {
    return <div>Video not found</div>;
  }

  const channel = getChannel(video.channelId);
  const channelAvatar = getImage(video.channelAvatarId);
  const thumbnail = getImage(video.thumbnailId);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
      <div className="flex-grow lg:w-2/3">
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted shadow-lg">
          {showPlayer && thumbnail ? (
            <div className="h-full w-full bg-black">
              {/* A real video player would go here */}
              <Image
                src={thumbnail.imageUrl}
                alt={video.title}
                fill
                className="object-contain"
                data-ai-hint={thumbnail.imageHint}
              />
            </div>
          ) : (
            <div
              className="relative flex h-full w-full cursor-pointer items-center justify-center"
              onClick={() => setShowPlayer(true)}
            >
              {thumbnail && (
                <Image
                  src={thumbnail.imageUrl}
                  alt={video.title}
                  fill
                  className="object-cover"
                  data-ai-hint={thumbnail.imageHint}
                />
              )}
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
              <PlayCircle className="relative z-10 h-20 w-20 text-white/80 drop-shadow-lg transition-transform hover:scale-110" />
            </div>
          )}
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
          <div className="mt-4 flex flex-wrap gap-2">
            {['AI', 'Tech', 'Documentary', 'Future'].map(tag => (
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
        <h2 className="font-headline text-xl font-bold mb-4">Up Next</h2>
        <div className="flex flex-col gap-4">
          {relatedVideos
            .filter(relatedVideo => relatedVideo.id !== videoId)
            .map(relatedVideo => (
              <CompactVideoCard key={relatedVideo.id} video={relatedVideo} />
            ))}
        </div>
      </div>
    </div>
  );
}
