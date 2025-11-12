'use client';

import { VideoCard } from '@/components/video/video-card';
import { getTrendingVideos, type Video } from '@/app/lib/data';
import { Suspense, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

function VideoGrid() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    async function initialLoad() {
      setLoading(true);
      const { videos: newVideos, nextPageToken: token } = await getTrendingVideos();
      setVideos(newVideos);
      setNextPageToken(token);
      setLoading(false);
    }
    initialLoad();
  }, []);

  const handleLoadMore = async () => {
    if (!nextPageToken) return;
    setLoadingMore(true);
    const { videos: newVideos, nextPageToken: token } = await getTrendingVideos(nextPageToken);
    setVideos(prevVideos => [...prevVideos, ...newVideos]);
    setNextPageToken(token);
    setLoadingMore(false);
  };

  if (loading) {
    return <p>Memuat video tren...</p>;
  }

  if (videos.length === 0) {
    return <p>Tidak dapat memuat video trending saat ini. Coba beberapa saat lagi.</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map(video => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
      {nextPageToken && (
        <div className="mt-8 flex justify-center">
          <Button onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memuat...
              </>
            ) : (
              'Muat Lebih Banyak'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-headline mb-4 text-2xl font-bold">Lagi Tren</h2>
        <Suspense fallback={<p>Memuat video tren...</p>}>
          <VideoGrid />
        </Suspense>
      </div>
    </div>
  );
}
