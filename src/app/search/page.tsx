import VideoCard from '@/components/VideoCard';
import { getTrendingVideos, searchVideos, type Video } from '@/lib/youtube';
import { PageContainer, SectionTitle } from '@/components/Layout';

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q;
  let videos: Video[] | null = [];
  let title = 'Trending';

  if (query) {
    videos = await searchVideos(query);
    title = `Search results for "${query}"`;
  } else {
    videos = await getTrendingVideos();
  }

  return (
    <PageContainer>
      <SectionTitle title={title} />
      {videos && videos.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          {query ? 'No videos found for your search.' : 'Could not load videos.'}
        </p>
      )}
    </PageContainer>
  );
}
