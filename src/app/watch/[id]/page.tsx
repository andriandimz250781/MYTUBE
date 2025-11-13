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
        
        // --- LOGIKA REKOMENDASI BARU ---
        // Cari video berdasarkan nama channel dari video saat ini untuk rekomendasi yang lebih baik
        const { videos: smartRelated } = await searchVideosByQuery(videoData.channelName);
        let related = smartRelated.filter(v => v.id !== id);

        // Jika hasil pencarian kurang dari 5, tambahkan dari video trending
        if (related.length < 5) {
          const { videos: trending } = await getTrendingVideos();
          const trendingFiller = trending.filter(
            v => v.id !== id && !related.some(r => r.id === v.id)
          );
          related = [...related, ...trendingFiller];
        }

        setRelatedVideos(related);
        // --- AKHIR LOGIKA REKOMENDASI BARU ---

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
      if (document.fullscreenElement) {
        playerRef.current.getInternalPlayer()?.playVideo?.();
      } else {
        if (wrapper.requestFullscreen) {
          await wrapper.requestFullscreen();
        } else if ((wrapper as any).webkitRequestFullscreen) {
          await (wrapper as any).webkitRequestFullscreen();
        } else if ((wrapper as any).msRequestFullscreen) {
          await (wrapper as any).msRequestFullscreen();
        }
        // Paksa putar setelah berhasil fullscreen
        playerRef.current.getInternalPlayer()?.playVideo?.();
      }
    } catch (err) {
      console.warn("Fullscreen request failed:", err);
      // Jika fullscreen gagal, coba putar saja.
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
    // Autoplay untuk video selanjutnya, namun tidak akan memaksa fullscreen lagi.
    if (shouldAutoplay && !loading && videoId) {
      const timer = setTimeout(() => {
        setIsPlaying(true);
        setShowPlayButton(false);
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

  useEffect(() => {
    const lockOrientation = async () => {
       if (screen.orientation && typeof screen.orientation.lock === 'function') {
        try {
            await screen.orientation.lock('landscape');
        } catch (err) {
            if (err.name !== 'SecurityError' && err.name !== 'NotSupportedError') {
                console.error("Gagal mengunci orientasi:", err);
            }
        }
      }
    }

    const unlockOrientation = () => {
        if (screen.orientation && typeof screen.orientation.unlock === 'function') {
            screen.orientation.unlock();
        }
    }

    const onFullscreenChange = () => {
      if (document.fullscreenElement) {
        setIsPlaying(true);
        setShowPlayButton(false);
        playerRef.current?.getInternalPlayer()?.playVideo?.();
        lockOrientation();
      } else {
        setIsPlaying(false);
        // Jangan tampilkan tombol play lagi setelah keluar fullscreen
        // agar pengguna tidak perlu klik dua kali untuk play lagi
        // setShowPlayButton(true); 
        unlockOrientation();
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
                backgroundPosition: 'center'
              }}
             >
                <PlayCircle className="h-20 w-20 text-white/80 drop-shadow-lg" />
             </div>
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
