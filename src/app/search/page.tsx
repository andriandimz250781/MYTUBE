import { VideoCard } from '@/components/video/video-card';
import { videos } from '@/app/lib/data';
import { Suspense } from 'react';

function SearchResults({ query }: { query: string }) {
  const searchResults = videos.slice(0, 8); // Mock results

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {searchResults.map(video => (
        <VideoCard key={video.id} video={video} />
      ))}
      {searchResults.length === 0 && <p>No videos found.</p>}
    </div>
  );
}

export default function SearchPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || '';

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold mb-6">
        Search results for: <span className="text-primary">{query || '...'}</span>
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchResults query={query} />
      </Suspense>
    </div>
  );
}
