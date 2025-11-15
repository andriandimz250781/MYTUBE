import VideoCard from '@/components/VideoCard';
import { PageContainer, SectionTitle } from '@/components/Layout';
import type { Video } from '@/lib/youtube';
import { getTrendingVideos } from '@/lib/youtube';
import { Suspense } from 'react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import HomePageWrapper from '@/components/HomePageWrapper';

async function TrendingVideos() {
  const videos = await getTrendingVideos();

  if (!videos || videos.length === 0) {
    return <p>Could not load videos. Check API keys in .env.local.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map(video => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <HomePageWrapper>
      <PageContainer>
        <SectionTitle title="Trending" />
        <Suspense fallback={<LoadingSkeleton />}>
          <TrendingVideos />
        </Suspense>
      </PageContainer>
    </HomePageWrapper>
  );
}
