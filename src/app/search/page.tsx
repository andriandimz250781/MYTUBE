'use client';

import { VideoCard } from '@/components/video/video-card';
import { searchVideos, type Video } from '@/lib/data';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function SearchResults({ query }: { query: string }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const newVideos = await searchVideos(query);
      setVideos(newVideos || []);
      setLoading(false);
    }
    if (query) {
      load();
    } else {
      setVideos([]);
      setLoading(false);
    }
  }, [query]);

  if (loading) {
    return <div>Searching...</div>;
  }

  if (videos.length === 0 && query) {
    return <p>No videos found for &quot;{query}&quot;.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map(video => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold mb-6">
        Search Results for: <span className="text-primary">{query || '...'}</span>
      </h1>
      <Suspense fallback={<div>Loading search results...</div>}>
        <SearchResults query={query} />
      </Suspense>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search page...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
