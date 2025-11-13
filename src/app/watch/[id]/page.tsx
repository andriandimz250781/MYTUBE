'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { getTrendingVideos, getVideo, getChannel, getImage, searchVideosByQuery } from '@/app/lib/data';
import type { Video } from '@/app/lib/data';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CompactVideoCard } from '@/components/video/compact-video-card';
import ReactPlayer from 'react-player/youtube';
import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, PlayCircle } from 'lucide-react';

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasWindow, setHasWindow] = useState(false);
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
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
      setShowPlayButton(true);
      setIsPlaying(false);
      try {
        const videoData = await getVideo(id);
        if (!videoData) {
          console.error('Video not found');
          setLoading(false);
          return;
        }
        setVideo(videoData);

        try {
          // Menyimpan riwayat dengan channel dan tags
          let history: { channelName: string; tags: string[] }[] = JSON.parse(
            localStorage.getItem('watchHistory') || '[]'
          );
          history.unshift({ channelName: videoData.channelName, tags: videoData.tags.slice(0, 5) }); // Ambil 5 tag pertama
          if (history.length > 20) {
            history = history.slice(0, 20);
          }
          localStorage.setItem('watchHistory', JSON.stringify(history));
        } catch (e) {
          console.error('Failed to save watch history:', e);
        }
        
        let related: Video[] = [];
        const existingIds = new Set<string>([id]);

        const addVideos = (videos: Video[]) => {
          const newVideos = videos.filter(v => v && v.id && !existingIds.has(v.id));
          newVideos.forEach(v => existingIds.add(v.id));
          related = [...related, ...newVideos];
        };

        // 1. Prioritas utama: Cari berdasarkan nama channel
        const channelSearchResponse = await searchVideosByQuery(videoData.channelName);
        addVideos(channelSearchResponse.videos);
        
        // 2. Jika kurang, cari berdasarkan genre/tag utama video (untuk pindah channel sejenis)
        if (related.length < 10 && videoData.tags && videoData.tags.length > 0) {
            const primaryTag = videoData.tags.find(tag => !tag.toLowerCase().includes('official') && tag.length > 3) || videoData.tags[0];
            if (primaryTag) {
              const genreSearchResponse = await searchVideosByQuery(primaryTag);
              addVideos(genreSearchResponse.videos);
            }
        }

        // 3. Pilihan terakhir: Tambahkan dari video trending jika masih kurang
        if (related.length < 10) {
          const trendingResponse = await getTrendingVideos();
          addVideos(trendingResponse.videos);
        }

        setRelatedVideos(related.slice(0, 10));

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
    const wrapper = playerWrapperRef.current;
    if (!wrapper || !playerRef.current) return;

    setIsPlaying(true);
    setShowPlayButton(false);

    try {
      if (!document.fullscreenElement) {
        if (wrapper.requestFullscreen) {
          await wrapper.requestFullscreen();
        } else if ((wrapper as any).webkitRequestFullscreen) {
          await (wrapper as any).webkitRequestFullscreen();
        } else if ((wrapper as any).msRequestFullscreen) {
          await (wrapper as any).msRequestFullscreen();
        }
      }
      playerRef.current.getInternalPlayer()?.playVideo?.();
    } catch (err) {
      console.warn("Fullscreen request failed, playing inline:", err);
      playerRef.current.getInternalPlayer()?.playVideo?.();
    }
  };


  const handleAutoplayNext = () => {
    if (relatedVideos.length > 0) {
      const nextVideo = relatedVideos[0];
      router.push(`/watch/${nextVideo.id}?autoplay=true`);
    }
  };

  useEffect(() => {
    if (shouldAutoplay && !loading && videoId) {
      const timer = setTimeout(() => {
        handlePlayFullscreen();
      }, 500); 
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldAutoplay, loading, videoId]);


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

  const lockOrientation = async () => {
      if (screen.orientation && typeof screen.orientation.lock === 'function') {
        try {
          await screen.orientation.lock('landscape');
        } catch (err) {
          console.warn("Could not lock orientation:", err);
        }
      }
    };

    const unlockOrientation = () => {
      if (screen.orientation && typeof screen.orientation.unlock === 'function') {
        try {
         screen.orientation.unlock();
        } catch(err) {
          console.warn("Could not unlock orientation:", err);
        }
      }
    };

  useEffect(() => {
    const onFullscreenChange = () => {
      if (document.fullscreenElement) {
        lockOrientation();
      } else {
        setIsPlaying(false);
        setShowPlayButton(true);
        unlockOrientation();
        playerRef.current?.getInternalPlayer()?.pauseVideo?.();
      }
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
      unlockOrientation();
    };
  }, []);

  if (loading || !video) {
    return <div className="flex h-full w-full items-center justify-center"><p>Memuat video...</p></div>;
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
              onPlay={() => {
                setIsPlaying(true);
                setShowPlayButton(false);
              }}
              onPause={() => setIsPlaying(false)}
              onEnded={handleAutoplayNext}
              muted={true}
              className="bg-black"
            />
          )}
          {showPlayButton && (
            <div
              className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50"
              onClick={handlePlayFullscreen}
              style={{
                backgroundImage: `url(${video.thumbnailUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
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
                    <span className="sr-only">Kembali ke Beranda</span>
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
