import { VideoCard } from '@/components/video/video-card';
import { getTrendingVideos } from '@/lib/data';

export default async function Home() {
  const trendingVideos = await getTrendingVideos();
  const forYouVideos = trendingVideos ? [...trendingVideos].sort(() => 0.5 - Math.random()).slice(0, 4) : [];

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-headline mb-4 text-2xl font-bold">Trending</h2>
        {trendingVideos && trendingVideos.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {trendingVideos.slice(0, 4).map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <p>Could not load trending videos. Please check your API key.</p>
        )}
      </div>
      <div>
        <h2 className="font-headline mb-4 text-2xl font-bold">For You</h2>
        {forYouVideos.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {forYouVideos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
        ) : (
          <p>No videos available.</p>
        )}
      </div>
      <div>
        <h2 className="font-headline mb-4 text-2xl font-bold">More Videos</h2>
        {trendingVideos && trendingVideos.length > 4 ? (
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {trendingVideos.slice(4).map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
         ) : (
          <p>No more videos available.</p>
        )}
      </div>
    </div>
  );
}
