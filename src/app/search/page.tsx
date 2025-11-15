import VideoCard from '@/components/VideoCard';
import { getTrendingVideos, searchVideos, type Video } from '@/lib/youtube';
import { PageContainer, SectionTitle } from '@/components/Layout';
import { Suspense } from 'react';
import LoadingSkeleton from '@/components/LoadingSkeleton';

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

async function SearchResults({ query }: { query?: string }) {
  let videos: Video[] | null = [];
  let title = 'Trending';

  if (query) {
    videos = await searchVideos(query);
    title = `Search results for "${query}"`;
  } else {
    videos = await getTrendingVideos();
  }
  
  if (!videos || videos.length === 0) {
     return (
        <p className="text-center text-muted-foreground">
          {query ? 'No videos found for your search.' : 'Could not load videos.'}
        </p>
      );
  }

  return (
    <>
        <SectionTitle title={title} />
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
    </>
  )
}


export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q;

  return (
    <PageContainer>
       <Suspense key={query} fallback={<LoadingSkeleton />}>
        <SearchResults query={query} />
       </Suspense>
    </PageContainer>
  );
}
