import { VideoCard } from '@/components/video/video-card';
import { getTrendingVideos } from '@/lib/data';

export default async function HistoryPage() {
  const allVideos = await getTrendingVideos();
  const watchedVideos = allVideos ? allVideos.slice(4, 9) : []; // Mock data

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold mb-6">Watch History</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {watchedVideos.map(video => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
