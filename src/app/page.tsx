import VideoCard from '@/components/VideoCard';
import { PageContainer, SectionTitle } from '@/components/Layout';
import type { Video } from '@/lib/youtube';
import { getTrendingVideos } from '@/lib/youtube';

export default async function Home() {
  const videos = await getTrendingVideos();

  return (
    <PageContainer>
      <SectionTitle title="Trending" />
      {videos && videos.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <p>Could not load videos. Check API keys in .env.local.</p>
      )}
    </PageContainer>
  );
}
