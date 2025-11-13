'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { getTrendingVideos, getVideo, getChannel, getImage } from '@/app/lib/data';
import type { Video } from '@/app/lib/data';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CompactVideoCard } from '@/components/video/compact-video-card';
import ReactPlayer from 'react-player/youtube';
import { useEffect, useState, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasWindow, setHasWindow] = useState(false);
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerWrapperRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReactPlayer>(null);
  const videoId = params.id as string;

  const isMusicOrKaraoke = video?.tags.some(tag =>
    ['music', 'karaoke', 'musik'].includes(tag.toLowerCase())
  );

  const shouldAutoplay = searchParams.get('autoplay') === 'true';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasWindow(true);
    }

    async function fetchData(id: string) {
      if (!id) return;

      setLoading(true);
      // Set isPlaying based on autoplay param
      setIsPlaying(shouldAutoplay);
      try {
        const videoData = await getVideo(id);
        if (!videoData) {
          console.error('Video not found');
          setLoading(false);
          return;
        }
        setVideo(videoData);

        const { videos: trending } = await getTrendingVideos();
        setRelatedVideos(trending.filter(v => v.id !== id));
      } catch (error) {
        console.error("Failed to fetch video data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (videoId) {
      fetchData(videoId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);


  const handlePlayFullscreen = async () => {
    setIsPlaying(true);
    const wrapper = playerWrapperRef.current;
    if (wrapper) {
      try {
        if (wrapper.requestFullscreen) {
          await wrapper.requestFullscreen();
        } else if ((wrapper as any).webkitRequestFullscreen) { /* Safari */
          (wrapper as any).webkitRequestFullscreen();
        } else if ((wrapper as any).msRequestFullscreen) { /* IE11 */
          (wrapper as any).msRequestFullscreen();
        }
        
        if (screen.orientation && typeof screen.orientation.lock === 'function') {
          await screen.orientation.lock('landscape').catch(err => {
            if (err.name !== 'SecurityError' && err.name !== 'NotSupportedError') {
              console.error("Gagal mengunci orientasi:", err);
            }
          });
        }
      } catch (err) {
        // Biarkan saja jika gagal, kemungkinan karena batasan browser/lingkungan
      }
    }
  };

  const handleAutoplayNext = () => {
    if (relatedVideos.length > 0) {
      const nextVideo = relatedVideos[0];
      router.push(`/watch/${nextVideo.id}?autoplay=true`);
    }
  };
  
  useEffect(() => {
    if (shouldAutoplay && !loading && video) {
      // Langsung coba play dan masuk fullscreen
      handlePlayFullscreen();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldAutoplay, loading, video]);


  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isMusicOrKaraoke && isPlaying) {
        playerRef.current?.getInternalPlayer()?.playVideo?.();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPlaying, isMusicOrKaraoke]);

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
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('mozfullscreenchange', onFullscreenChange);
    document.addEventListener('MSFullscreenChange', onFullscreenChange);
    
    return () => {
        document.removeEventListener('fullscreenchange', onFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
        document.removeEventListener('mozfullscreenchange', onFullscreenChange);
        document.removeEventListener('MSFullscreenChange', onFullscreenChange);
    }
  }, []);


  if (loading || !video) {
    return <div>Memuat video...</div>;
  }

  const channel = getChannel(video.channelId);
  const channelAvatar = getImage(video.channelAvatarId);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
      <div className="flex-grow lg:w-2/3">
        <div ref={playerWrapperRef} className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-lg relative">
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
              onEnded={handleAutoplayNext}
              className="bg-black"
              light={!isPlaying && !shouldAutoplay ? video.thumbnailUrl : false}
              playIcon={<button onClick={handlePlayFullscreen} className="absolute inset-0 flex items-center justify-center w-full h-full bg-black/30"><svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%" className="w-16 h-16"><path className="fill-black/80" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"></path><path className="fill-white" d="M 45,24 27,14 27,34"></path></svg></button>}
              onClickPreview={(e) => {
                e.preventDefault();
                handlePlayFullscreen();
              }}
            />
          )}
        </div>
        <div className="py-4">
          <div className="mb-2 flex items-center gap-2">
             <Button variant="ghost" size="icon" className="shrink-0" asChild>
                <Link href="/">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
             </Button>
             <h1 className="font-headline text-xl md:text-2xl font-bold">
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
                  {channel?.subscribers} pelanggan
                </p>
              </div>
            </div>
            <Button
              variant="default"
              className="w-full rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90 sm:w-auto"
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
